import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Companies = sequelize.define('company', {
    companyName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    industry: {
        type: DataTypes.ENUM(
            'it',
            'finance',
            'healthcare',
            'education',
            'manufacturing',
            'retail',
            'hospitality',
            'real_estate',
            'construction',
            'transportation',
            'telecommunications',
            'energy',
            'agriculture',
            'media',
            'government',
            'non_profit',
            'ecommerce',
            'marketing',
            'legal',
            'travel',
            'others'
        ),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    paranoid: true     // enables soft deletes using deletedAt
});


export default Companies;
