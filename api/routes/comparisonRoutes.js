import express from 'express';
import prisma from '../lib/prisma.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all comparisons for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const comparisons = await prisma.comparison.findMany({
      where: { userId: req.user.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(comparisons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add property to comparisons
router.post('/', auth, async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if already in comparisons
    const existing = await prisma.comparison.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Property already in comparisons' });
    }

    const comparison = await prisma.comparison.create({
      data: {
        userId: req.user.id,
        projectId: projectId,
      },
    });

    res.status(201).json(comparison);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove property from comparisons
router.delete('/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    await prisma.comparison.delete({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    res.json({ message: 'Property removed from comparisons' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if property is in comparisons
router.get('/check/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const comparison = await prisma.comparison.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    res.json({ isCompared: !!comparison });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
