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
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue('skills');

            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                'skills',
                Array.isArray(value) ? value : []
            );
        }
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
    isBlacklisted: {
        type: DataTypes.ENUM('yes', 'no'),
        allowNull: false,
        defaultValue: 'no',
    },
    blacklistedReason: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    paranoid: true
});

export default Users;
