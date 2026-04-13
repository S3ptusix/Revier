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
    linkedIn: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    portfolio: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    resume: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    validId: {
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
    isVerified: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
    },
    savedJobs: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue("savedJobs");
            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                "savedJobs",
                Array.isArray(value) ? value : []
            );
        },
    }
}, {
    paranoid: true
});

export default Users;
