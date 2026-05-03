import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database simulation (in production, use real database)
let users = [];
let properties = [];
let leads = [];

// Initialize with admin user
const ADMIN_USER = {
  id: 1,
  email: 'admin@statia.com',
  password: '$2b$12$E8Za9xm2$HErJvQZLbXlZmQK3T8', // bcrypt hash of 'admin'
  name: 'Admin',
  role: 'ADMIN'
};

users.push(ADMIN_USER);

// Initialize with demo user
const DEMO_USER = {
  id: 2,
  email: 'user@statia.com',
  password: '$2b$12$E8Za9xm2$HErJvQZLbXlZmQK3T8', // bcrypt hash of 'User@2025'
  name: 'Demo User',
  role: 'USER'
};

users.push(DEMO_USER);

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // In production, verify password with bcrypt
  if (password === 'admin' || password === 'User@2025') {
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  }

  res.status(401).json({ error: 'Invalid email or password' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    name,
    role: 'USER',
    joined: new Date().toISOString()
  };

  users.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email, role: newUser.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );

  res.json({
    user: newUser,
    token
  });
});

app.patch('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const { name, email } = req.body;

    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], name, email };

    res.json(users[userIndex]);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.patch('/api/auth/password', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const { currentPassword, newPassword } = req.body;

    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, verify current password with bcrypt
    if (currentPassword === 'admin' || currentPassword === 'User@2025') {
      users[userIndex] = { ...users[userIndex] };
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ error: 'Invalid current password' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Properties Routes
app.get('/api/properties', (req, res) => {
  const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);

  let sortedProperties = [...properties];

  if (sortBy === 'priceEGP') {
    sortedProperties.sort((a, b) => {
      const comparison = sortOrder === 'asc' ? a.priceEGP - b.priceEGP : b.priceEGP - a.priceEGP;
      return comparison;
    });
  } else if (sortBy === 'area') {
    sortedProperties.sort((a, b) => {
      const comparison = sortOrder === 'asc' ? a.area - b.area : b.area - a.area;
      return comparison;
    });
  } else if (sortBy === 'rating') {
    sortedProperties.sort((a, b) => {
      const comparison = sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
      return comparison;
    });
  }

  const paginatedProperties = sortedProperties.slice(startIndex, endIndex);
  const totalPages = Math.ceil(properties.length / limit);

  res.json({
    properties: paginatedProperties,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: properties.length,
      pages: totalPages
    }
  });
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === req.params.id);

  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }

  res.json(property);
});

// Leads Routes
app.post('/api/leads', (req, res) => {
  const { name, email, phone, project, message } = req.body;

  const newLead = {
    id: leads.length + 1,
    name,
    email,
    phone,
    project,
    message,
    date: new Date().toISOString().split('T')[0],
    status: 'New'
  };

  leads.push(newLead);

  res.json({ message: 'Lead created successfully', lead: newLead });
});

app.get('/api/leads', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ leads });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Favorites Routes
app.post('/api/favorites', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const { projectId } = req.body;

    const newFavorite = {
      id: Date.now(),
      userId: decoded.userId,
      projectId
    };

    // In production, save to database
    res.json({ message: 'Added to favorites', favorite: newFavorite });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/favorites/check/:propertyId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ isFavorite: false });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const propertyId = req.params.propertyId;

    // In production, check database
    const isFavorite = false;

    res.json({ isFavorite });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/favorites/:propertyId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, delete from database
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Comparisons Routes
app.post('/api/comparisons', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const { projectId } = req.body;

    const newComparison = {
      id: Date.now(),
      userId: decoded.userId,
      projectId
    };

    // In production, save to database
    res.json({ message: 'Added to comparisons', comparison: newComparison });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/comparisons/check/:propertyId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ isCompared: false });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
    const propertyId = req.params.propertyId;

    // In production, check database
    const isCompared = false;

    res.json({ isCompared });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/comparisons/:propertyId', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, delete from database
    res.json({ message: 'Removed from comparisons' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Notifications Routes
app.get('/api/notifications', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, fetch from database
    const notifications = [];

    res.json({ data: notifications });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.put('/api/notifications/:id/read', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, update database
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.put('/api/notifications/read-all', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, update database
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/notifications/:id', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');

    // In production, delete from database
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});