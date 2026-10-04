const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Store, Rating } = require('../models');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search = '' } = req.query;

    const stores = await Store.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } },
        ],
      },
      include: [
        {
          model: Rating,
          attributes: [],
        },
      ],
      attributes: {
        include: [[fn('AVG', col('Ratings.rating')), 'averageRating']],
      },
      group: ['Store.id'],
      order: [['name', 'ASC']],
      subQuery: false,
    });

    return res.json(stores);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch stores', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id, {
      include: [
        {
          model: Rating,
          attributes: ['id', 'rating', 'review', 'userId', 'createdAt'],
        },
      ],
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const averageRating = store.Ratings.length
      ? store.Ratings.reduce((acc, item) => acc + item.rating, 0) / store.Ratings.length
      : 0;

    return res.json({
      ...store.toJSON(),
      averageRating,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch store', error: error.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { name, address, description } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Name and address are required' });
    }

    const store = await Store.create({ name, address, description });
    return res.status(201).json(store);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create store', error: error.message });
  }
});

module.exports = router;
