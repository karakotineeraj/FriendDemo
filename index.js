require('dotenv').config();

const express = require('express'),
      app = express();

const { Sequelize, DataTypes, Model } = require('sequelize');

app.use(express.json());

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    dialect: process.env.DB_DIALECT
});

class User extends Model{};
class FriendRequest extends Model{};

User.init({
    userId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        required: true,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'user',
    timestamps: false
});

FriendRequest.init({
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'userId'
        }
    },
    receiverId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'userId'
        }
    }
}, {
    sequelize,
    modelName: 'friendrequest',
    timestamps: false
})

User.belongsToMany(User, { 
    as: 'sender',
    foreignKey: 'senderId',
    through: 'friendrequests',
    unique: false
});

User.belongsToMany(User, {
    as: 'receiver',
    through: 'friendrequests',
    foreignKey: 'receiverId',
    unique: false
});

sequelize.sync({force: true});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server has started on port ${process.env.SERVER_PORT}...`);
});