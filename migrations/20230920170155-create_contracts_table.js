'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('contracts', {
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('contracts');
  }
};
