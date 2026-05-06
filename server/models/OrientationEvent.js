import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const OrientationEvents = sequelize.define('orientationEvent', {
    eventTitle: {
        type: DataTypes.STRING(255),
        allowNull: false
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
        allowNull: true,
    },
}, {
    paranoid: true
});

export default OrientationEvents;
