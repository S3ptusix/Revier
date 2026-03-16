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
        type: DataTypes.ENUM('New', 'Interview', 'Orientation', 'Hired'),
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
    interviewMode: {
        type: DataTypes.ENUM('In-Person', 'Virtual (Video Call)', 'Phone Call'),
        allowNull: true,
    },
    interviewLocation: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    interviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    orientationStatus: {
        type: DataTypes.ENUM('Pending', 'Present', 'Absent'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    orientationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isRejected: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: false,
        defaultValue: 'No'
    },
    blacklistedReason: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    paranoid: true
});

export default Applicants;
