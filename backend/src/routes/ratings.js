const express = require('express');
const { Rating, Store, User } = require('../models');
const { auth } = require('../middleware/auth');
const { authenticatedWriteLimiter } = require('../middleware/rateLimit');

const router = express.Router();

router.get('/store/:storeId', async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { storeId: req.params.storeId },
      include: [
        { model: User, attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.json(ratings);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch ratings', error: error.message });
  }
});

router.post('/', authenticatedWriteLimiter, auth, async (req, res) => {
  try {
    const { storeId, rating, review } = req.body;

    if (!storeId || !rating) {
      return res.status(400).json({ message: 'storeId and rating are required' });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'rating should be between 1 and 5' });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const existingRating = await Rating.findOne({
      where: {
        storeId,
        userId: req.user.id,
      },
    });

    if (existingRating) {
      existingRating.rating = numericRating;
      existingRating.review = review || null;
      await existingRating.save();
      return res.json(existingRating);
    }

    const newRating = await Rating.create({
      storeId,
      userId: req.user.id,
      rating: numericRating,
      review: review || null,
    });

    return res.status(201).json(newRating);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to save rating', error: error.message });
  }
});

module.exports = router;
