const { Sequelize, DataTypes, Model } = require('sequelize');

class ContractModel extends Model {}

ContractModel.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      contractAddress: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      contractOwner: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      price: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      soldTickets: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      maxTickets: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      ticketName: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      ticketSymbol: {
        type: Sequelize.STRING(8),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
},{sequelize, modelName: 'contracts'});

module.exports = ContractModel;