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
    },
    assignedCompanies: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
            const raw = this.getDataValue('assignedCompanies');

            if (Array.isArray(raw)) return raw;

            try {
                return raw ? JSON.parse(raw) : [];
            } catch {
                return [];
            }
        },
        set(value) {
            this.setDataValue(
                'assignedCompanies',
                Array.isArray(value) ? value : []
            );
        }
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
    }
}, {
    paranoid: true     // enables soft deletes using deletedAt
});

export default Admins;
