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
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sex: {
        type: DataTypes.ENUM('Male', 'Female'),
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
    validId: {
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
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    blacklistedReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    blacklistedBy: {
        type: DataTypes.INTEGER, // HR/Admin ID
        allowNull: true
    },
    canApplyAgainAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    employmentStatus: {
        type: DataTypes.ENUM(
            'Not Started',
            'Active',
            'Contract Finished',
            'Resigned',
            'Terminated'
        ),
        defaultValue: 'Not Started'
    },
    hiredAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
}, {
    paranoid: true
});

export default Applicants;
