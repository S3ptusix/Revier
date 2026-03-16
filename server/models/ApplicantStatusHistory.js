import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

const ApplicantStatusHistory = sequelize.define('applicantStatusHistory', {
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    applicantStatus: {
        type: DataTypes.ENUM('New', 'Interview', 'Orientation', 'Hired'),
        allowNull: false
    },
}, {
    paranoid: true
});

export default ApplicantStatusHistory;
