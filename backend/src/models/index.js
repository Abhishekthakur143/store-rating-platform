const sequelize = require('../config/database');
const User = require('./user');
const Store = require('./store');
const Rating = require('./rating');

User.hasMany(Rating, { foreignKey: 'userId', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
