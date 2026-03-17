import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Notification = sequelize.define('notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    message: {
        type: DataTypes.STRING,
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
