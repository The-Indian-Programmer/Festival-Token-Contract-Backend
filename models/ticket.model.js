const { DataTypes } = require('sequelize');
const sequelize = require('../services/databaseConnection');
const Contract = require('./contract.model');

const Ticket = sequelize.define('Ticket', {
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
  userAddress: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ticketPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isListed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ticketBaughtFrom: {
    type: DataTypes.ENUM('marketplace', 'token'),
    allowNull: false,
  },
}, {
  tableName: 'user_tickets',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

Contract.hasMany(Ticket, { foreignKey: 'contractId' });
Ticket.belongsTo(Contract, { foreignKey: 'contractId' });


Ticket.getUserTicketList = async (contractAddress, userAddress) => {
  return new Promise((resolve, reject) => {
    Ticket.findAll({
      include: [
        {
          model: Contract,
          required: true,
          where: { contractAddress }, // Add a WHERE condition for the Contract model
          attributes: []
        },
      ], attributes: ['id', 'userAddress', 'ticketId', 'ticketPrice', 'isListed', 'ticketBaughtFrom', 'createdAt']
    },
    )
      .then((tickets) => {
        let data = !helper.isEmpty(tickets) ? tickets.map(item => item.dataValues) : [];
        resolve({ err: null, data: data })
      })
      .catch((error) => {
        resolve({ err: error, data: [] })
      });
  });

};





module.exports = Ticket;