import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Notification = sequelize.define('notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subTitle: {
        type: DataTypes.STRING,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('success', 'info', 'warning', 'error'),
        allowNull: false,
        defaultValue: 'info'
    }
}, {
    paranoid: true
});

export default Notification;
