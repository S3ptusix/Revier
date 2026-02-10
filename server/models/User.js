import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Users = sequelize.define('user', {
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    phone: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    otp: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    otpExpireAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    resume: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
    },
}, {
    paranoid: true
});

export default Users;
