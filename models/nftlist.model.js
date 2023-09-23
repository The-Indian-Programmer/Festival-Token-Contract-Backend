const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../services/databaseConnection'); // Assuming you have a Sequelize instance set up in a separate file
const Contract = require('./contract.model');
const NftListing = sequelize.define('nft_listing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contractId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Contract,
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  sellerAddress: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
},{
    tableName: 'nft_listing',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  });

// Define associations if needed
Contract.hasMany(NftListing, { foreignKey: 'contractId' });
NftListing.belongsTo(Contract, { foreignKey: 'contractId' });


NftListing.getAllTicketList = async function (contractId) {
  return new Promise((resolve, reject) => {
    NftListing.findAll({
      where: {
        contractId: contractId
      },
      order: [
        ['id', 'DESC']
      ],
      attributes: ['id', 'sellerAddress', 'ticketId', 'price', 'createdAt'],
    }).then((result) => {
      resolve({ err: null, data: result })
    }).catch((err) => {
      reject({ err: err, data: null })
    })
  })
}

module.exports = NftListing;
