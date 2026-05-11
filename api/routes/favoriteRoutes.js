import express from 'express';
import prisma from '../lib/prisma.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all favorites for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { project: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add property to favorites
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

    // Check if already in favorites
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: req.user.id,
        projectId: projectId,
      },
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove property from favorites
router.delete('/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    await prisma.favorite.delete({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check if property is in favorites
router.get('/check/:projectId', auth, async (req, res) => {
  try {
    const { projectId } = req.params;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: projectId,
        },
      },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
