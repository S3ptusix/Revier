import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Applicants = sequelize.define('applicant', {
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fullname: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
        allowNull: false,
    },
    applicantStatus: {
        type: DataTypes.ENUM('New', 'Interview', 'Orientation', 'Hired', 'Rejected'),
        allowNull: false,
        defaultValue: 'New',
    },
    interviewStatus: {
        type: DataTypes.ENUM('Pending', 'Passed', 'Failed'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    interviewAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    orientationStatus: {
        type: DataTypes.ENUM('Pending', 'Present', 'Absent'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    orientationAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    paranoid: true
});

export default Applicants;
