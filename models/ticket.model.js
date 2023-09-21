const { Sequelize, DataTypes, Model } = require('sequelize');

class UserTicket extends Model {
    static associate(models) {
        // define association here
    }
}

UserTicket.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contractAddress: {
        type: DataTypes.STRING(64),
        length: 64,
        allowNull: false,
    },
    userAddress: {
        type: DataTypes.STRING(64),
        length: 64,
        allowNull: false,
    },
    ticketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isListed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    ticketBaughtFrom: {
        type: DataTypes.ENUM("marketplace", "token"),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    }
},{sequelize, modelName: 'user_tickets'});

module.exports = UserTicket;