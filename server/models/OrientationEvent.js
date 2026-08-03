import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const OrientationEvents = sequelize.define('orientationEvent', {
    eventTitle: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    eventMode: {
        type: DataTypes.ENUM('In-Person', 'Virtual (Video Call)'),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    eventAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    paranoid: true
});

export default OrientationEvents;
