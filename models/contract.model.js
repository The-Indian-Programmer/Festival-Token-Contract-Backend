const { DataTypes } = require('sequelize');
const sequelize = require('../services/databaseConnection');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contractAddress: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  contractOwner: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING(4),
    allowNull: false,
  },
  soldTickets: {
    type: DataTypes.INTEGER(4),
    allowNull: false,
  },
  maxTickets: {
    type: DataTypes.INTEGER(4),
    allowNull: false,
  },
  ticketName: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  ticketSymbol: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
}, {
  tableName: 'contracts',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = Contract;