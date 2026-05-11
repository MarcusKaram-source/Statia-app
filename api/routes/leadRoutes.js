import express from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import auth, { requireAdmin } from '../middleware/authMiddleware.js';

const VALID_STATUSES = ['NEW', 'CONTACTED', 'CLOSED'];

const router = express.Router();

// Create a new lead (public)
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Invalid phone number'),
  body('message').optional().trim().escape(),
  body('projectId').optional().isUUID().withMessage('Invalid project ID'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message, projectId } = req.body;

    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) return res.status(404).json({ error: 'Project not found' });
    }

    const lead = await prisma.lead.create({
      data: { name, email, phone, message, projectId },
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all leads (admin only) — supports ?page=1&limit=20
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        include: { project: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.lead.count(),
    ]);
    res.json({ leads, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update lead status (admin only)
router.patch('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: { status },
      include: { project: true },
    });
    res.json(lead);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') return res.status(404).json({ error: 'Lead not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a lead (admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.lead.delete({ where: { id: req.params.id } });
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') return res.status(404).json({ error: 'Lead not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
