'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable("user_tickets", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      contractId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "contracts",
          key: "id",
          onDelete: "CASCADE",  
        },
      },
      userAddress: {
        type: Sequelize.STRING(64),
        length: 64,
        allowNull: false,
      },
      ticketId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ticketPrice: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      isListed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ticketBaughtFrom: {
        type: Sequelize.ENUM("marketplace", "token"),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      }
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('user_tickets');
  }
};
