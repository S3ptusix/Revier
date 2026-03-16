import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Admins = sequelize.define('admin', {
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('HR Manager', 'HR Associate'),
        allowNull: false,
        defaultValue: 'HR Associate',
    }
}, {
    paranoid: true     // enables soft deletes using deletedAt
});

export default Admins;
