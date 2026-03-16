import { Op } from 'sequelize';
import Admins from '../models/Admin.js';
import { Applicants, Users, Jobs, Companies, ApplicantStatusHistory, OrientationEvents } from '../models/index.js'

// FETCH APPLICANTS PIPELINE
export const fetchApplicantPipelineService = async (adminId) => {
    try {

        let pipeline = {
            new: [],
            interview: [],
            orientation: [],
        }

        const statusNew = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'blacklistedReason',
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['blacklistedReason'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName'],
                            required: true
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'New',
                isRejected: 'No',
            }
        });

        const statusInterview = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'interviewStatus',
                'interviewAt',
                'blacklistedReason',
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['blacklistedReason'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName'],
                            required: true
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'Interview',
                isRejected: 'No',
            }
        });

        const statusOrientation = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'phone',
                'orientationStatus',
                'blacklistedReason',
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['blacklistedReason'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: ['eventAt']
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName'],
                            required: true
                        }
                    ]
                }
            ],
            where: {
                applicantStatus: 'Orientation',
                isRejected: 'No',
            }
        });

        pipeline.new = statusNew;
        pipeline.interview = statusInterview;
        pipeline.orientation = statusOrientation;

        return {
            success: true,
            pipeline,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// MOVE APPLICANT
export const moveApplicantService = async (applicantId, applicantStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !applicantStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicantStatusArray = ['New', 'Interview', 'Orientation', 'Hired'];

        applicantStatus = applicantStatusArray.includes(applicantStatus) ? applicantStatus : 'New';

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['applicantStatus', 'interviewStatus', 'orientationStatus']
        })

        if (applicantStatus === 'Orientation' && applicant.interviewStatus == 'Pending') {
            return {
                success: false,
                message: 'Interview is still Pending.'
            }
        }
        if (applicantStatus === 'Hired' && applicant.orientationStatus == 'Pending') {
            return {
                success: false,
                message: 'Orientation is still Pending.'
            }
        }

        await Applicants.update({
            applicantStatus
        }, {
            where: { id: applicantId }
        });

        await ApplicantStatusHistory.create({
            applicantId,
            applicantStatus
        });

        return {
            success: true,
            message: "Applicant move successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH APPLICANT STATUS HISTORY
export const fetchApplicantStatusHistoryService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicantStatusHistory = await ApplicantStatusHistory.findAll({
            attributes: ['applicantStatus', 'createdAt'],
            where: { applicantId }
        });

        return {
            success: true,
            statusHistory: applicantStatusHistory
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsService = async (interviewStatus) => {
    try {

        const whereClause = {
            applicantStatus: 'interview',
            isRejected: 'No',
        };

        if (interviewStatus) {
            whereClause.interviewStatus = interviewStatus;
        }

        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'interviewStatus',
                'interviewAt',
                'interviewLocation',
                'blacklistedReason'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email'],
                    required: true,
                    include: [
                        {
                            model: Applicants,
                            attributes: ['blacklistedReason'],
                            where: {
                                blacklistedReason: {
                                    [Op.ne]: null
                                }
                            },
                            required: false
                        }
                    ]
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName'],
                            required: true
                        }
                    ]
                }
            ],
            where: whereClause
        });

        return {
            success: true,
            applicants,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ONE INTERVIEW
export const fetchOneInterviewsService = async (applicantId) => {
    try {
        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: [
                'interviewAt',
                'interviewMode',
                'interviewLocation',
                'interviewNotes'
            ]
        });


        return {
            success: true,
            applicant
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};
// RESCHEDULE INTERVIEW
export const RescheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes,
) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewStatus: 'Pending',
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes,
        }, {
            where: { id: applicantId }
        });


        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// SCHEDULE INTERVIEW
export const scheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewAt,
            interviewMode,
            interviewLocation,
            interviewNotes
        }, {
            where: { id: applicantId }
        });

        return {
            success: true,
            message: "Applicant scheduled for interview successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// INTERVIEW RESULT
export const interviewResultService = async (applicantId, interviewStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const interviewStatusArray = ['Passed', 'Failed'];

        interviewStatus = interviewStatusArray.includes(interviewStatus) ? interviewStatus : 'Passed';

        await Applicants.update({
            interviewStatus
        }, {
            where: { id: applicantId }
        });

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// IS REJECTED
export const isRejectedService = async (applicantId, isRejected) => {
    try {

        if (
            isNaN(applicantId) ||
            !isRejected?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const isRejectedArray = ['Yes', 'No'];

        isRejected = isRejectedArray.includes(isRejected) ? isRejected : 'No';

        await Applicants.update({
            isRejected
        }, {
            where: { id: applicantId }
        });

        return {
            success: true,
            message: "Applicant move successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FETCH APPLICANT TOTALS
export const fetchApplicantTotalService = async (adminId) => {
    try {

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalApplicants: 0,
            inProcess: 0,
            hired: 0,
            rejected: 0,
        };

        totals.totalApplicants = await Applicants.count();
        totals.inProcess = await Applicants.count({
            where: {
                applicantStatus: {
                    [Op.in]: ['New', 'Interview', 'Orientation']
                },
                isRejected: 'No'
            }
        });
        totals.hired = await Applicants.count({ where: { applicantStatus: 'Hired' } });
        totals.rejected = await Applicants.count({ where: { isRejected: 'Yes' } });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH INTERVIEW TOTALS
export const fetchInterviewTotalService = async (adminId) => {
    try {

        const admin = await Admins.findByPk(adminId);

        if (!admin) {
            return { success: false, message: "Admin not found." };
        }

        let totals = {
            totalInterviewed: 0,
            pendingInterviews: 0,
            passed: 0,
            failed: 0,
        };

        totals.totalInterviewed = await Applicants.count({
            where: {
                interviewStatus: {
                    [Op.in]: ['Passed', 'Failed']
                }
            }
        });
        totals.pendingInterviews = await Applicants.count({
            where: {
                applicantStatus: 'Interview',
                interviewStatus: 'Pending',
                isRejected: 'No'
            }
        });
        totals.passed = await Applicants.count({ where: { interviewStatus: 'Passed' } });
        totals.failed = await Applicants.count({ where: { interviewStatus: 'Failed' } });

        return {
            success: true,
            totals,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

