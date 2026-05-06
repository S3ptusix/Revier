import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const AdminLog = sequelize.define('adminLog', {
    adminId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    logStatus: {
        type: DataTypes.ENUM('login', 'logout'),
        allowNull: false
    }
}, {
    paranoid: true
});

export default AdminLog;
