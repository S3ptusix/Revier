import { Op, fn, col, where } from "sequelize";
import Admins from '../models/Admin.js';
import { Applicants, Users, Jobs, Companies, ApplicantStatusHistory, OrientationEvents, Notification } from '../models/index.js'

// PIPELINE 
export const fetchApplicantPipelineService = async (
    search = "",
    companyId = ""
) => {
    try {
        const whereClause = {
            isRejected: "No",
        };

        // =========================
        // SEARCH (FIRST + LAST NAME FIXED)
        // =========================
        if (search) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
                { "$user.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job->company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        const applicants = await Applicants.findAll({
            attributes: [
                "id",
                "firstName",   // ✅ updated
                "lastName",    // ✅ updated
                "phone",
                "applicantStatus",
                "interviewStatus",
                "interviewAt",
                "orientationId",
                "orientationStatus",
                "blacklistedReason",
            ],
            where: whereClause,
            include: [
                {
                    model: Users,
                    attributes: ["email"],
                    required: true,
                    include: {
                        model: Applicants,
                        attributes: ["id"],
                        required: false,
                        where: {
                            blacklistedReason: { [Op.ne]: null }
                        },
                    }
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ["jobTitle"],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: "company",
                            attributes: ["companyName"],
                            required: true,
                        },
                    ],
                },
                {
                    model: OrientationEvents,
                    attributes: ["eventTitle", "eventAt"],
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
            subQuery: false,
        });

        const pipeline = {
            new: [],
            interview: [],
            orientation: [],
        };

        applicants.forEach((app) => {
            if (app.applicantStatus === "New") {
                pipeline.new.push(app);
            } else if (app.applicantStatus === "Interview") {
                pipeline.interview.push(app);
            } else if (app.applicantStatus === "Orientation") {
                pipeline.orientation.push(app);
            }
        });

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
export const moveApplicantService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle']
                }
            ]
        })

        if (!applicant) return { success: false, message: 'Applicant not found.' };

        await Applicants.update({
            applicantStatus: 'Interview'
        }, {
            where: { id: applicantId }
        });

        await ApplicantStatusHistory.create({
            applicantId,
            applicantStatus: 'Interview'
        });

        await Notification.create({
            userId: applicant?.userId,
            message: `Good news! Your application for the ${applicant?.job?.jobTitle} position is now scheduled for an interview. Please stay tuned for your interview details.`
        });

        return {
            success: true,
            message: "Applicant moved to interview successfully"
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
export const fetchAllInterviewsService = async (
    search = '',
    companyId = '',
    page = 1,
) => {
    try {
        const limit = 10;

        const whereClause = {
            applicantStatus: 'Interview',
            isRejected: 'No',
        };

        const jobWhere = {};
        if (companyId) {
            jobWhere.companyId = companyId;
        }

        // SEARCH
        if (search) {
            whereClause[Op.or] = [
                where(
                    fn(
                        "concat",
                        col("applicant.firstName"),
                        " ",
                        col("applicant.lastName")
                    ),
                    { [Op.like]: `%${search}%` }
                ),
                { "$User.email$": { [Op.like]: `%${search}%` } },
                { "$job.jobTitle$": { [Op.like]: `%${search}%` } },
                { "$job.company.companyName$": { [Op.like]: `%${search}%` } },
            ];
        }

        const offset = (page - 1) * limit;

        const { count, rows: applicants } = await Applicants.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
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
                            attributes: ['id'],
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
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: whereClause,
            limit,
            offset,
            distinct: true,
            subQuery: false
        });

        return {
            success: true,
            applicants,
            pagination: {
                total: count,
                totalPages: Math.ceil(count / limit)
            }
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

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim()
        ) {
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

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle']
                }
            ]
        })

        await Notification.create({
            userId: applicant?.userId,
            message: `Interview Rescheduled | Your interview for the ${applicant?.job?.jobTitle} position has been rescheduled to ${interviewAt} (${interviewMode}) at ${interviewLocation}.${interviewNotes ? ` Notes: ${interviewNotes}` : ''}`
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
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim()
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

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle']
                }
            ]
        })

        await Notification.create({
            userId: applicant?.userId,
            message: `Interview Scheduled | You have an interview for the ${applicant?.job?.jobTitle} position on ${interviewAt} (${interviewMode}) at ${interviewLocation}.${interviewNotes ? ` Notes: ${interviewNotes}` : ''}`
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

        if (interviewStatus === 'Passed') {
            await Applicants.update({
                applicantStatus: 'Orientation',
                interviewStatus
            }, {
                where: { id: applicantId }
            });

            await ApplicantStatusHistory.create({
                applicantId,
                applicantStatus: 'Orientation'
            });
        } else {

            await Applicants.update({
                isRejected: 'Yes',
                interviewStatus
            }, {
                where: { id: applicantId }
            });

            await ApplicantStatusHistory.create({
                applicantId,
                applicantStatus: 'Rejected'
            });
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle']
                }
            ]
        })

        await Notification.create({
            userId: applicant?.userId,
            message: interviewStatus === 'Passed'
                ? `Congratulations! You passed the interview for the ${applicant?.job?.jobTitle} position. You will proceed to the orientation stage. Please wait for further details.`
                : `Thank you for attending the interview for the ${applicant?.job?.jobTitle} position. Your result is "${interviewStatus}". We appreciate your time and interest.`,
            type: interviewStatus === 'Passed' ? 'success' : 'error'
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
export const isRejectedService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        await Applicants.update({
            isRejected: 'Yes'
        }, {
            where: { id: applicantId }
        });

        await ApplicantStatusHistory.create({
            applicantId,
            applicantStatus: 'Rejected'
        });

        await Applicants.update({
            canApplyAgainAt: null
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle']
                }
            ]
        })


        await Notification.create({
            userId: applicant?.userId,
            message:
                applicant?.applicantStatus === 'Hired' ?
                    `Status Update: The employment record for the ${jobTitle} position has been closed.` :
                    `We regret to inform you that your application for the ${applicant?.job?.jobTitle} position was not successful.`
            ,
            type: 'error'
        });

        return { success: true }

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

// APPLICANT DETAILS
export const applicantDetailsService = async (applicantId) => {
    try {
        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: [
                'userId',
                'firstName',
                'lastName',
                'sex',
                'phone',
                'createdAt',
                'linkedIn',
                'portfolio',
                'resume',
                'validId',
                'interviewAt',
                'interviewMode',
                'interviewLocation',
                'interviewStatus',
                'orientationStatus',
                'applicantStatus'
            ],
            include: [
                {
                    model: Users,
                    attributes: ['email']
                },
                {
                    model: Jobs,
                    attributes: ['jobTitle'],
                    as: 'job',
                    include: [
                        {
                            model: Companies,
                            attributes: ['companyName'],
                            as: 'company'
                        }
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventAt',
                        'eventTitle',
                        'location'
                    ]
                }, {
                    model: ApplicantStatusHistory,
                    attributes: ['applicantStatus', 'createdAt']
                }
            ]
        });

        const userId = applicant.userId;
        const blacklist = await Applicants.findAll({
            attributes: ['blacklistedReason'],
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: ['jobTitle'],
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ],
            where: {
                userId,
                blacklistedReason: {
                    [Op.ne]: null
                }
            }
        })

        return {
            success: true,
            applicant,
            blacklist
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};