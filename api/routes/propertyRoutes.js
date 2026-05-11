import express from 'express';
import prisma from '../lib/prisma.js';
import auth, { requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all properties with search and filters (public)
router.get('/', async (req, res) => {
  try {
    const {
      search,
      type,
      status,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minRooms,
      maxRooms,
      minBaths,
      maxBaths,
      location,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    const where = {};

    // Search by name or location
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameAr: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { locationAr: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Filter by type
    if (type) {
      where.type = type;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Filter by price range
    const minPriceVal = minPrice !== undefined && minPrice !== '' ? parseFloat(minPrice) : NaN;
    const maxPriceVal = maxPrice !== undefined && maxPrice !== '' ? parseFloat(maxPrice) : NaN;
    if (!isNaN(minPriceVal) || !isNaN(maxPriceVal)) {
      where.priceEGP = {};
      if (!isNaN(minPriceVal)) where.priceEGP.gte = minPriceVal;
      if (!isNaN(maxPriceVal)) where.priceEGP.lte = maxPriceVal;
    }

    // Filter by area range
    const minAreaVal = minArea !== undefined && minArea !== '' ? parseFloat(minArea) : NaN;
    const maxAreaVal = maxArea !== undefined && maxArea !== '' ? parseFloat(maxArea) : NaN;
    if (!isNaN(minAreaVal) || !isNaN(maxAreaVal)) {
      where.area = {};
      if (!isNaN(minAreaVal)) where.area.gte = minAreaVal;
      if (!isNaN(maxAreaVal)) where.area.lte = maxAreaVal;
    }

    // Filter by rooms range
    const minRoomsVal = minRooms !== undefined && minRooms !== '' ? parseInt(minRooms) : NaN;
    const maxRoomsVal = maxRooms !== undefined && maxRooms !== '' ? parseInt(maxRooms) : NaN;
    if (!isNaN(minRoomsVal) || !isNaN(maxRoomsVal)) {
      where.rooms = {};
      if (!isNaN(minRoomsVal)) where.rooms.gte = minRoomsVal;
      if (!isNaN(maxRoomsVal)) where.rooms.lte = maxRoomsVal;
    }

    // Filter by baths range
    const minBathsVal = minBaths !== undefined && minBaths !== '' ? parseInt(minBaths) : NaN;
    const maxBathsVal = maxBaths !== undefined && maxBaths !== '' ? parseInt(maxBaths) : NaN;
    if (!isNaN(minBathsVal) || !isNaN(maxBathsVal)) {
      where.baths = {};
      if (!isNaN(minBathsVal)) where.baths.gte = minBathsVal;
      if (!isNaN(maxBathsVal)) where.baths.lte = maxBathsVal;
    }

    // Filter by location
    if (location) {
      where.OR = where.OR || [];
      where.OR.push(
        { location: { contains: location, mode: 'insensitive' } },
        { locationAr: { contains: location, mode: 'insensitive' } }
      );
    }

    // Filter by amenities
    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : amenities.split(',');
      where.amenities = {
        hasSome: amenityList
      };
    }

    // Calculate pagination with safe bounds
    const safePage = Math.max(1, parseInt(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const skip = (safePage - 1) * safeLimit;
    const take = safeLimit;

    // Get total count
    const total = await prisma.project.count({ where });

    // Whitelist sortBy to prevent field enumeration
    const ALLOWED_SORT_FIELDS = ['createdAt', 'priceEGP', 'name', 'rating', 'area', 'rooms'];
    const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

    // Get properties with sorting and pagination
    const properties = await prisma.project.findMany({
      where,
      orderBy: {
        [safeSortBy]: safeSortOrder
      },
      skip,
      take
    });

    res.json({
      properties,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get property by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const property = await prisma.project.findUnique({ where: { id } });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a property (admin only)
router.post('/', auth, requireAdmin, async (req, res) => {
  try {
    const { name, nameAr, location, locationAr, type, status, priceEGP, priceSAR, priceAED, rooms, baths, area, badge, description, img, amenities } = req.body;
    if (!name || !priceEGP) {
      return res.status(400).json({ error: 'name and priceEGP are required' });
    }
    const property = await prisma.project.create({
      data: {
        name,
        nameAr: nameAr || '',
        location: location || '',
        locationAr,
        type: type || 'Apartment',
        status: status || 'Under Construction',
        priceEGP: parseFloat(priceEGP),
        priceSAR: priceSAR ? parseFloat(priceSAR) : null,
        priceAED: priceAED ? parseFloat(priceAED) : null,
        rooms: parseInt(rooms) || 1,
        baths: parseInt(baths) || 1,
        area: parseFloat(area) || 0,
        badge,
        description,
        img,
        amenities: amenities || [],
      },
    });
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a property (admin only)
router.patch('/:id', auth, requireAdmin, async (req, res) => {
  try {
    const { name, nameAr, location, locationAr, type, status, priceEGP, priceSAR, priceAED, rooms, baths, area, badge, description, img, amenities } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (nameAr !== undefined) data.nameAr = nameAr;
    if (location !== undefined) data.location = location;
    if (locationAr !== undefined) data.locationAr = locationAr;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (priceEGP !== undefined) data.priceEGP = parseFloat(priceEGP);
    if (priceSAR !== undefined) data.priceSAR = priceSAR ? parseFloat(priceSAR) : null;
    if (priceAED !== undefined) data.priceAED = priceAED ? parseFloat(priceAED) : null;
    if (rooms !== undefined) data.rooms = parseInt(rooms);
    if (baths !== undefined) data.baths = parseInt(baths);
    if (area !== undefined) data.area = parseFloat(area) || 0;
    if (badge !== undefined) data.badge = badge;
    if (description !== undefined) data.description = description;
    if (img !== undefined) data.img = img;
    if (amenities !== undefined) data.amenities = amenities;
    const property = await prisma.project.update({ where: { id: req.params.id }, data });
    res.json(property);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') return res.status(404).json({ error: 'Property not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a property (admin only)
router.delete('/:id', auth, requireAdmin, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: 'Property deleted' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') return res.status(404).json({ error: 'Property not found' });
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
