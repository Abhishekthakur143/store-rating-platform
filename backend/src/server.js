require('dotenv').config();
const app = require('./app');
const { sequelize, Store } = require('./models');

const PORT = Number(process.env.PORT || 5000);

const seedStores = async () => {
  const storeCount = await Store.count();
  if (storeCount > 0) {
    return;
  }

  await Store.bulkCreate([
    {
      name: 'Downtown Mart',
      address: '101 Main Street',
      description: 'Convenience store with daily essentials.',
    },
    {
      name: 'Fresh Basket',
      address: '22 Lakeview Avenue',
      description: 'Organic produce and groceries.',
    },
    {
      name: 'City Electronics',
      address: '88 Tech Park',
      description: 'Appliances and electronic accessories.',
    },
  ]);
};

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedStores();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
