import { failedInterviewHTML, forOrientationHTML, rescheduleInterviewHTML } from '../emailTemplates/interviewTemplates.js';
import { Applicants, Companies, Jobs, Notification, OrientationEvents, Users } from '../models/index.js'
import { convertPHToUTC, convertUTCToPH, formatDateTime, renderMessageWithLinks } from '../utils/format.js';
import { sendMail } from '../utils/mailer.js';
import { io } from "../server.js";
import { buildScheduleSummary } from '../utils/messageBuilder.js';
import { Op, fn, col, where } from "sequelize";
import { getCompanyScope } from '../utils/getCompanyScope.js';
import { generateContactAdminMessage } from '../utils/generateMessage.js';

// FETCH ALL INTERVIEWS
export const fetchAllInterviewsService = async (
    search = '',
    companyId = '',
    page = 1,
    role,
    adminId
) => {
    try {
        search = search.trim();

        const limit = 10;
        const offset = (page - 1) * limit;

        const whereClause = {
            applicantStatus: 'Interview',
            isRejected: false
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
            ];
        }

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) {
            return {
                success: true,
                applicants: [],
                pagination: { total: 0, totalPages: 0 }
            };
        }

        // ---- STEP 1: get ALL matching, ordered applicant IDs (plain SELECT, no aggregates) ----
        const idRowsAll = await Applicants.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: [],
                    required: true
                },
                {
                    model: Jobs,
                    as: 'job',
                    attributes: [],
                    where: jobWhere,
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: [],
                            required: true,
                            where: scope.companyWhere
                        }
                    ]
                }
            ],
            where: whereClause,
            order: [['interviewAt', 'ASC'], ['id', 'ASC']],
            subQuery: false,
            raw: true
        });

        const count = idRowsAll.length;
        const totalPages = Math.ceil(count / limit);

        if (count === 0) {
            return {
                success: true,
                applicants: [],
                pagination: {
                    total: 0,
                    totalPages: 0
                }
            };
        }

        // ---- STEP 1b: slice to the requested page ----
        const pageRows = idRowsAll.slice(offset, offset + limit);

        if (pageRows.length === 0) {
            return {
                success: true,
                applicants: [],
                pagination: {
                    total: count,
                    totalPages
                }
            };
        }

        const idOrder = pageRows.map(r => r.id);

        // ---- STEP 2: hydrate full data for just those IDs ----
        let applicants = await Applicants.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'interviewStatus',
                'interviewMode',
                'interviewAt',
                'interviewLocation',
                'blacklistedReason'
            ],
            where: {
                id: idOrder
            },
            include: [
                {
                    model: Users,
                    as: "user",
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
                    required: true,
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
                        }
                    ]
                }
            ]
        });

        // Re-apply the exact order from step 1
        const orderIndex = new Map(idOrder.map((id, i) => [id, i]));
        applicants.sort(
            (a, b) => orderIndex.get(a.id) - orderIndex.get(b.id)
        );

        return {
            success: true,
            applicants,
            pagination: {
                total: count,
                totalPages
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

// FAILED INTERVIEW
export const failedInterviewService = async (
    applicantId,
    rejectedReason,
    rejectedReasonNote,
    admin
) => {
    try {

        if (
            isNaN(applicantId) ||
            !rejectedReason?.trim() ||
            !rejectedReasonNote?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            applicantStatus: "Interview",
            interviewStatus: "Failed",
            isRejected: true,
            rejectedAt: new Date(),
            rejectedReason,
            rejectedReasonNote
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
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
            ]
        })

        const contactAdmin = generateContactAdminMessage(admin);

        const message = `Thank you for taking the time to interview for the ${applicant?.job?.jobTitle} position at ${applicant?.job?.company?.companyName}.
        
After careful review, we regret to inform you that we will not be proceeding with your application at this time.

Feedback: ${rejectedReasonNote}

We appreciate your interest and encourage you to apply again in the future.

${contactAdmin}`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message,
            type: 'error'
        });
        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);


        await sendMail({
            to: applicant.user.email,
            subject: `Interview Update – ${applicant?.job?.jobTitle}`,
            html: failedInterviewHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                rejectedReasonNote: renderMessageWithLinks(rejectedReasonNote),
                contactAdmin: renderMessageWithLinks(contactAdmin)
            })
        });

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// RESCHEDULE INTERVIEW
export const rescheduleInterviewService = async (
    applicantId,
    interviewAt,
    interviewMode,
    interviewLocation,
    interviewNotes,
    scheduleSummary,
    admin
) => {
    try {

        if (
            isNaN(applicantId) ||
            !interviewAt?.trim() ||
            !interviewMode?.trim() ||
            !interviewLocation?.trim() ||
            !interviewNotes?.trim() ||
            !scheduleSummary?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            interviewAt: convertPHToUTC(interviewAt),
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
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
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
            ]
        });

        const contactAdmin = generateContactAdminMessage(admin);

        const message = `Updated Details:
${scheduleSummary} 
       
Notes:
${interviewNotes} 

Please ensure you are available at the scheduled time.
            
Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.

${contactAdmin}`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        await sendMail({
            to: applicant.user.email,
            subject: `Interview Rescheduled – ${applicant?.job?.jobTitle}`,
            html: rescheduleInterviewHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary: renderMessageWithLinks(scheduleSummary),
                interviewNotes: renderMessageWithLinks(interviewNotes),
                contactAdmin: renderMessageWithLinks(contactAdmin)
            })
        });

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// FOR ORIENTATION
export const forOrientationService = async (
    applicantId,
    orientationId,
    admin
) => {
    try {
        if (
            isNaN(applicantId) ||
            isNaN(orientationId)
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            applicantStatus: 'Orientation',
            interviewStatus: 'Passed',
            orientationId
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
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
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventTitle',
                        'location',
                        'eventAt',
                        'eventMode',
                        'note'

                    ]
                }
            ]
        });

        const event = applicant?.orientationEvent;

        const scheduleSummary = buildScheduleSummary({
            eventTitle: event.eventTitle,
            eventAt: convertUTCToPH(event.eventAt),
            location: event.location,
            eventMode: event.eventMode,
        });

        const contactAdmin = generateContactAdminMessage(admin);

        const message = `You Passed Your Interview
        
Schedule Details:
${(scheduleSummary)}

Notes:
${event?.note}

Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.

${contactAdmin}`;

        if (event) {
            const notification = await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message,
                type: "success"
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);
        }

        await sendMail({
            to: applicant.user.email,
            subject: `Orientation Scheduled – ${applicant?.job?.jobTitle}`,
            html: forOrientationHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary: renderMessageWithLinks(scheduleSummary),
                eventNote: renderMessageWithLinks(event?.note),
                contactAdmin: renderMessageWithLinks(contactAdmin)
            })
        });

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// BULK FOR ORIENTATION
export const bulkForOrientationService = async (
    applicantIds,
    orientationId,
    admin
) => {
    try {
        if (!Array.isArray(applicantIds) || applicantIds.length === 0 || isNaN(orientationId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        orientationId = Number(orientationId);

        // Fetch the orientation event up front — this is what applicants are being assigned to
        const orientationEvent = await OrientationEvents.findOne({
            where: { id: orientationId },
            attributes: ['eventTitle', 'location', 'eventAt', 'eventMode', 'note']
        });

        if (!orientationEvent) {
            return {
                success: false,
                message: "Selected orientation could not be found."
            };
        }

        // Fetch applicants first so we can check interview status before mutating anything
        const applicants = await Applicants.findAll({
            where: { id: applicantIds },
            attributes: ['id', 'userId', 'interviewAt', 'interviewStatus'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
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
            ]
        });

        const now = new Date();

        // Split into applicants whose interview has already happened vs still upcoming
        const eligibleApplicants = applicants.filter(a => !a.interviewAt || new Date(a.interviewAt) <= now);
        const upcomingApplicants = applicants.filter(a => a.interviewAt && new Date(a.interviewAt) > now);

        if (eligibleApplicants.length === 0) {
            return {
                success: false,
                message: "All selected applicants still have an upcoming interview."
            };
        }

        const eligibleIds = eligibleApplicants.map(a => a.id);

        await Applicants.update({
            applicantStatus: 'Orientation',
            interviewStatus: 'Passed',
            orientationId
        }, {
            where: { id: eligibleIds }
        });

        // Build the schedule summary once — it's the same orientation for every eligible applicant
        const scheduleSummary = buildScheduleSummary({
            eventTitle: orientationEvent.eventTitle,
            eventAt: convertUTCToPH(orientationEvent.eventAt),
            location: orientationEvent.location,
            eventMode: orientationEvent.eventMode,
        });

        const contactAdmin = generateContactAdminMessage(admin);

        // Process each eligible applicant individually, one at a time
        for (const applicant of eligibleApplicants) {
            const message = `You Passed Your Interview

Schedule Details:
${scheduleSummary}

Notes:
${orientationEvent?.note}

Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.

${contactAdmin}`;

            const notification = await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message,
                type: "success"
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);

            if (applicant?.user?.email) {
                await sendMail({
                    to: applicant.user.email,
                    subject: `Orientation Scheduled – ${applicant?.job?.jobTitle}`,
                    html: forOrientationHTML({
                        firstName: applicant?.user?.firstName,
                        jobTitle: applicant?.job?.jobTitle,
                        companyName: applicant?.job?.company?.companyName,
                        scheduleSummary: renderMessageWithLinks(scheduleSummary),
                        eventNote: renderMessageWithLinks(orientationEvent?.note),
                        contactAdmin: renderMessageWithLinks(contactAdmin)
                    })
                });
            }
        }

        return {
            success: true,
            skipped: upcomingApplicants.map(a => a.id), // let the caller know who was excluded
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// BULK FAILED INTERVIEW
export const bulkFailedInterviewService = async (
    applicantIds,
    rejectedReason,
    rejectedReasonNote,
    admin
) => {
    try {
        if (
            !Array.isArray(applicantIds) ||
            applicantIds.length === 0 ||
            !rejectedReason?.trim() ||
            !rejectedReasonNote?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        // Fetch applicants first so we can check interview timing before mutating anything
        const applicants = await Applicants.findAll({
            where: { id: applicantIds },
            attributes: ['id', 'userId', 'interviewAt'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                },
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
            ]
        });

        const now = new Date();

        // Split into applicants whose interview has already happened vs still upcoming
        const eligibleApplicants = applicants.filter(a => !a.interviewAt || new Date(a.interviewAt) <= now);
        const upcomingApplicants = applicants.filter(a => a.interviewAt && new Date(a.interviewAt) > now);

        if (eligibleApplicants.length === 0) {
            return {
                success: false,
                message: "All selected applicants still have an upcoming interview."
            };
        }

        const eligibleIds = eligibleApplicants.map(a => a.id);

        await Applicants.update({
            applicantStatus: "Interview",
            interviewStatus: "Failed",
            isRejected: true,
            rejectedAt: new Date(),
            rejectedReason,
            rejectedReasonNote
        }, {
            where: { id: eligibleIds }
        });

        const contactAdmin = generateContactAdminMessage(admin);

        for (const applicant of eligibleApplicants) {
            const message = `Thank you for taking the time to interview for the ${applicant?.job?.jobTitle} position at ${applicant?.job?.company?.companyName}.

After careful review, we regret to inform you that we will not be proceeding with your application at this time.

Feedback: ${rejectedReasonNote}

We appreciate your interest and encourage you to apply again in the future.

${contactAdmin}`;

            const notification = await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message,
                type: 'error'
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);

            if (applicant?.user?.email) {
                await sendMail({
                    to: applicant.user.email,
                    subject: `Interview Update – ${applicant?.job?.jobTitle}`,
                    html: failedInterviewHTML({
                        firstName: applicant?.user?.firstName,
                        jobTitle: applicant?.job?.jobTitle,
                        companyName: applicant?.job?.company?.companyName,
                        rejectedReasonNote: renderMessageWithLinks(rejectedReasonNote),
                        contactAdmin: renderMessageWithLinks(contactAdmin)
                    })
                });
            }
        }

        if (eligibleApplicants.length > 0) {
            io.to(`admins`).emit("dashboard");
        }

        return {
            success: true,
            skipped: upcomingApplicants.map(a => a.id), // let the caller know who was excluded
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}