import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import auth from '../middleware/authMiddleware.js';
import { sendVerificationEmail } from '../lib/email.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');

const SALT_ROUNDS = 12;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
}

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters').escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
], async (req, res) => {
  try {
    if (!handleValidation(req, res)) return;

    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'USER', emailVerifyToken },
    });

    const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${emailVerifyToken}`;
    await sendVerificationEmail(email, verifyUrl);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    if (!handleValidation(req, res)) return;

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil - new Date()) / 60000);
      return res.status(429).json({ error: `Account locked. Try again in ${remainingTime} minutes` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const failedAttempts = (user.failedAttempts || 0) + 1;

      if (failedAttempts >= 5) {
        const lockTime = new Date(Date.now() + 15 * 60000);
        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts, lockUntil: lockTime }
        });
        return res.status(429).json({ error: 'Too many failed attempts. Account locked for 15 minutes' });
      }

      await prisma.user.update({ where: { id: user.id }, data: { failedAttempts } });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockUntil: null }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current session user (restore on page load).
// Returns 200 { user: null } when not authenticated to avoid browser console red errors.
router.get('/me', async (req, res) => {
  try {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.header('Authorization');
      if (authHeader) token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    }
    if (!token) return res.json({ user: null });

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, isEmailVerified: true }
    });
    res.json({ user: user || null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Verify email address via token
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { emailVerifyToken: req.params.token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired verification token' });

    await prisma.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true, emailVerifyToken: null },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout — clears the auth cookie
router.post('/logout', (_req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out successfully' });
});

// Update profile (authenticated)
router.patch('/profile', auth, [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
], async (req, res) => {
  try {
    if (!handleValidation(req, res)) return;

    const { name, email } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const current = await prisma.user.findUnique({ where: { id: req.user.id } });
    const emailChanged = current.email !== email;

    const updateData = { name, email };
    if (emailChanged) {
      const emailVerifyToken = crypto.randomBytes(32).toString('hex');
      updateData.isEmailVerified = false;
      updateData.emailVerifyToken = emailVerifyToken;
      const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${emailVerifyToken}`;
      await sendVerificationEmail(email, verifyUrl);
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password (authenticated)
router.patch('/password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], async (req, res) => {
  try {
    if (!handleValidation(req, res)) return;

    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
