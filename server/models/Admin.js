import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Admins = sequelize.define('admin', {
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    sex: {
        type: DataTypes.ENUM('Male', 'Female'),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('HR Manager', 'HR Associate'),
        allowNull: false,
        defaultValue: 'HR Associate',
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otpExpireAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
    },
}, {
    paranoid: true     // enables soft deletes using deletedAt
});

export default Admins;
