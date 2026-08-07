import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const Applicants = sequelize.define('applicant', {
    // ======================
    // RELATIONS
    // ======================
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    // ======================
    // BASIC INFO
    // ======================
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
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    // ======================
    // LINKS / FILES
    // ======================
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
        allowNull: true
    },
    resumePublicId: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    validId: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    validIdPublicId: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    // ======================
    // PIPELINE STATUS
    // ======================
    applicantStatus: {
        type: DataTypes.ENUM('New', 'Interview', 'Orientation', 'Hired'),
        allowNull: false,
        defaultValue: 'New'
    },

    // ======================
    // INTERVIEW
    // ======================
    interviewStatus: {
        type: DataTypes.ENUM('Passed', 'Failed'),
        allowNull: true
    },
    interviewMode: {
        type: DataTypes.ENUM(
            'In-Person',
            'Virtual (Video Call)',
            'Phone Call'
        ),
        allowNull: true
    },
    interviewLocation: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    interviewNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    interviewAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // ======================
    // ORIENTATION
    // ======================
    orientationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    orientationStatus: {
        type: DataTypes.ENUM('Present', 'Absent'),
        allowNull: true
    },

    // ======================
    // REJECTION (IMPROVED)
    // ======================
    isRejected: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rejectedReason: {
        type: DataTypes.ENUM(
            'No Show',
            'Failed Interview',
            'Not Qualified',
            'Incomplete Requirements',
            'Candidate Withdrew',
            'Position Closed',
            'Blacklisted', // ✅ ADD THIS
            'Others'
        ),
        allowNull: true
    },
    rejectedReasonNote: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    rejectedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

    // ======================
    // BLACKLIST
    // ======================
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    blacklistedReason: {
        type: DataTypes.ENUM(
            'Fraudulent Activity',
            'Falsified Information',
            'Unprofessional Behavior',
            'No Show (Multiple Times)',
            'Policy Violation',
            'Others'
        )
    },
    blacklistedReasonNote: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    blacklistedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // ======================
    // RE-APPLICATION
    // ======================
    canApplyAgainAt: {
        type: DataTypes.DATE,
        allowNull: false
    },

    // ======================
    // EMPLOYMENT
    // ======================
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
    }

}, {
    paranoid: true
});

export default Applicants;
