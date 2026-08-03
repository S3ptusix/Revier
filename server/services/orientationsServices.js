import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, OrientationEvents, Users } from "../models/index.js";
import { convertPHToUTC, formatDateTime } from "../utils/format.js";
import { io } from "../server.js";
import { sendMail } from "../utils/mailer.js";
import { forOrientationHTML } from "../emailTemplates/interviewTemplates.js";
import { absentOnOrientationHTML, changeEventHTML, hiredHTML } from "../emailTemplates/orientationTemplates.js";
import { buildScheduleSummary } from "../utils/messageBuilder.js";

// CREATE ORIENTATION EVENT
export const createEventService = async (
    eventTitle,
    eventMode,
    location,
    eventAt,
    note
) => {
    try {

        if (
            !eventTitle.trim() ||
            !eventMode.trim() ||
            !location.trim() ||
            !eventAt.trim() ||
            !note.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const utcEventAt = convertPHToUTC(eventAt);

        await OrientationEvents.create({
            eventTitle,
            eventMode,
            location,
            eventAt: utcEventAt,
            note
        });

        io.to(`admins`).emit("dashboard");

        return {
            success: true,
            message: 'Orientation event created successfully'
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message
        }
    }
};

// FETCH ONE ORIENTATION EVENT
export const fetchOneOrientationEventService = async (orientationId) => {
    try {
        const orientation = await OrientationEvents.findOne({
            attributes: [
                'id',
                'eventTitle',
                'eventMode',
                'location',
                'eventAt',
                'note',
                [fn('COUNT', col('applicants.id')), 'attendeesCount']
            ],
            include: [
                {
                    model: Applicants,
                    attributes: []
                }
            ],
            where: {
                id: orientationId
            },
            group: ['id']
        });

        return {
            success: true,
            orientation
        };

    } catch (error) {
        console.error(error);

        return {
            success: false,
            message: error.message,
        };
    }
};

// FETCH ALL ORIENTATION EVENT
export const fetchAllOrientationEventService = async (
    page = 1,
) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count, rows: orientationEvents } =
            await OrientationEvents.findAndCountAll({
                attributes: [
                    'id',
                    'eventTitle',
                    'eventMode',
                    'location',
                    'eventAt',
                    'note'
                ],
                include: {
                    model: Applicants,
                    attributes: [
                        'firstName',
                        'lastName',
                        'orientationStatus'
                    ]
                },
                limit,
                offset,
                order: [['eventAt', 'DESC']], // optional but recommended
                distinct: true // IMPORTANT when using include
            });

        return {
            success: true,
            orientationEvents,
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

// FETCH ALL ORIENTATION EVENTS (CHANGE EVENT)
export const fetchAllOrientationEventCEService = async (
    applicantId = null,
    page = 1
) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        // Get the applicant's current orientation event
        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['orientationId']
        });

        const { count, rows: orientationEvents } =
            await OrientationEvents.findAndCountAll({
                attributes: [
                    'id',
                    'eventTitle',
                    'eventMode',
                    'location',
                    'eventAt',
                    'note'
                ],
                where: applicant?.orientationId
                    ? {
                        id: {
                            [Op.ne]: applicant.orientationId
                        }
                    }
                    : {},
                include: {
                    model: Applicants,
                    attributes: [
                        'firstName',
                        'lastName',
                        'orientationStatus'
                    ]
                },
                limit,
                offset,
                order: [['eventAt', 'DESC']],
                distinct: true
            });

        return {
            success: true,
            orientationEvents,
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

// FETCH ALL ORIENTATIONS
export const fetchAllOrientationService = async (
    search = "",
    companyId = '',
    page = 1
) => {
    try {

        search = search.trim();

        const limit = 10;

        const whereClause = {
            applicantStatus: 'Orientation',
            isRejected: false
        };

        const jobWhereClause = {};

        if (companyId) {
            jobWhereClause.companyId = companyId;
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

        const offset = (page - 1) * limit;

        const { count, rows: applicants } = await Applicants.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'orientationStatus',
                'blacklistedReason',
                'orientationId'
            ],
            include: [
                {
                    model: Users,
                    as: "user",
                    attributes: ['email'],
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
                    as: 'orientationEvent',
                    attributes: ['eventTitle'],
                    paranoid: false
                },
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle'],
                    where: jobWhereClause,
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
            order: [['createdAt', 'DESC']],
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

// FETCH ALL APPLICANTS FROM ORIENTATION
export const fetchAllApplicantsFromOrientationService = async (orientationId) => {
    try {
        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'orientationStatus',
                'applicantStatus',
                'isRejected'
            ],
            include: [
                {
                    model: Jobs,
                    as: "job",
                    attributes: ['jobTitle']
                }
            ],
            where: { orientationId }
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

// EDIT ORIENTATION STATUS
export const editOrientationStatusService = async (applicantId, orientationStatus) => {
    try {

        if (
            isNaN(applicantId) ||
            !orientationStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const orientationStatusArray = ['Pending', 'Present', 'Absent'];

        orientationStatus = orientationStatusArray.includes(orientationStatus) ? orientationStatus : 'Pending';

        if (orientationStatus === 'Present') {

            const applicant = await Applicants.findByPk(applicantId);

            const job = await Jobs.findByPk(applicant.jobId);

            if (job.slot <= 0) {
                return {
                    success: false,
                    message: 'No slots available for this job. cannot hire applicant.'
                }
            }

            await Jobs.decrement('slot', {
                by: 1,
                where: { id: applicant.jobId }
            });

            await Applicants.update({
                applicantStatus: 'Hired',
                hiredAt: new Date(),
                orientationStatus
            }, {
                where: { id: applicantId }
            });

        } else {
            await Applicants.update({
                isRejected: true,
                rejectedAt: new Date(),
                orientationStatus
            }, {
                where: { id: applicantId }
            });
        }

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
                        },
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventTitle',
                    ]
                }
            ]
        });

        const firstName = applicant?.user?.firstName;
        const jobTitle = applicant?.job?.jobTitle;
        const companyName = applicant?.job?.company?.companyName;

        let message = '';

        if (orientationStatus === 'Present') {

            message = `We are pleased to inform you that you have been successfully selected for the ${jobTitle} position at ${companyName}.
            
This opportunity has been facilitated through our recruitment process, and we are confident that your qualifications and experience make you a strong fit for the role.
            
The company will be reaching out to you shortly with further details regarding your onboarding, including your official start date and next steps.
            
Congratulations on your successful application — we wish you great success in your new role!`;

            await sendMail({
                to: applicant.user.email,
                subject: `Job Offer Confirmation – ${jobTitle}`,
                html: hiredHTML({
                    firstName: firstName,
                    jobTitle: jobTitle,
                    companyName: companyName
                })
            });

        } else if (orientationStatus === 'Absent') {

            message = `We would like to inform you that you were marked as Absent during your scheduled orientation for the ${jobTitle} position at ${companyName}.

As attendance in the orientation is a required step in the hiring process, your application will no longer proceed at this time.
            
We appreciate your time and interest in this opportunity, and we encourage you to apply again in the future.`;

            await sendMail({
                to: applicant.user.email,
                subject: `Application Update – ${jobTitle}`,
                html: absentOnOrientationHTML({
                    firstName: firstName,
                    jobTitle: jobTitle,
                    companyName: companyName
                })
            });
        }

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: jobTitle,
            subTitle: companyName,
            message,
            type: orientationStatus === 'Present' ? 'success' : 'error'
        });

        io.to(`admins`).emit("dashboard");
        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// DELETE ORIENTATION 
export const deleteOrientationService = async (OrientationId) => {
    try {

        const hasApplicants = await Applicants.findOne({
            where: { orientationId: OrientationId }
        });

        if (hasApplicants) {
            return {
                success: false,
                message: 'Cannot delete orientation event with registered applicants.'
            };
        }

        const affectedRows = await OrientationEvents.destroy({
            where: { id: OrientationId }
        });
        if (affectedRows === 0) {
            return {
                success: false,
                message: 'Orientation event not found'
            };
        }

        return {
            success: true,
            message: 'Orientation event deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// REMOVE FROM EVENT 
export const removeFromEventService = async (applicantId) => {
    try {

        if (isNaN(applicantId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        await Applicants.update({
            orientationId: null,
            orientationStatus: 'Pending'
        }, {
            where: { id: applicantId }
        });

        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['userId'],
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
                        },
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventTitle',
                    ]
                }
            ]
        });

        await Notification.create({
            userId: applicant?.userId,
            title: applicant?.job?.jobTitle,
            subTitle: applicant?.job?.company?.companyName,
            message: `You are no longer scheduled to attend the "${applicant?.orientationEvent?.eventTitle}" orientation for the ${applicant?.job?.jobTitle} position.`
        });

        return { success: true };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// NOTIFY APPLICANTS HELPER
const notifyApplicants = async ({
    applicants,
    message,
    scheduleSummary,
    event
}) => {
    return Promise.all(
        applicants.map(async (applicant) => {
            try {
                // 1. Create notification
                const notification = await Notification.create({
                    userId: applicant.userId,
                    title: applicant?.job?.jobTitle,
                    subTitle: applicant?.job?.company?.companyName,
                    message
                });

                // 2. Emit real-time notification
                io.to(`user_${applicant.userId}`).emit("newNotification", notification);

                // 3. Send email
                await sendMail({
                    to: applicant.user.email,
                    subject: `Orientation Updated – ${applicant?.job?.jobTitle}`,
                    html: changeEventHTML({
                        firstName: applicant?.user?.firstName,
                        jobTitle: applicant?.job?.jobTitle,
                        companyName: applicant?.job?.company?.companyName,
                        scheduleSummary,
                        eventNote: event?.note
                    })
                });

            } catch (error) {
                // ❗ Don't break entire process if one fails
                console.error(`❌ Failed to notify user ${applicant.userId}`, error);
            }
        })
    );
};

// EDIT ORIENTATION EVENT SERVICE
export const editOrientationEventService = async (
    orientationId,
    eventTitle,
    eventMode,
    location,
    eventAt,
    note
) => {
    try {

        
        // VALIDATION
        
        if (
            isNaN(orientationId) ||
            !eventTitle.trim() ||
            !eventMode.trim() ||
            !location.trim() ||
            !eventAt.trim() ||
            !note.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        const utcEventAt = convertPHToUTC(eventAt);

        
        // UPDATE EVENT
        
        await OrientationEvents.update(
            {
                eventTitle,
                eventMode,
                location,
                eventAt: utcEventAt,
                note
            },
            {
                where: { id: orientationId }
            }
        );

        // Update admin dashboard
        io.to(`admins`).emit("dashboard");


        
        // FETCH ALL APPLICANTS IN EVENT
        
        const applicants = await Applicants.findAll({
            where: { orientationId },
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
                    as: 'orientationEvent',
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

        
        // EDGE CASE: NO APPLICANTS
        
        if (!applicants.length) {
            return {
                success: true,
                message: "Event updated. No applicants to notify."
            };
        }

        const event = applicants[0]?.orientationEvent;

        
        // BUILD MESSAGE
        
        const scheduleSummary = buildScheduleSummary({
            eventTitle: event.eventTitle,
            eventAt: event.eventAt,
            location: event.location,
            eventMode: event.eventMode,
        });

        const message = `Updated Schedule Details:
${scheduleSummary}

Notes:
${event?.note}

Please make sure to take note of the updated schedule and attend on time. Candidates who are present will proceed with the hiring process, while those who are unable to attend may be considered not selected.`;


        
        // 🔥 NON-BLOCKING NOTIFICATIONS
        
        notifyApplicants({
            applicants,
            message,
            scheduleSummary,
            event
        }); // ❗ no await (runs in background)


        
        // RESPONSE (FAST)
        
        return {
            success: true,
            message: "Orientation event updated. Notifications are being sent."
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// FETCH ORIENTATION TOTALS
export const fetchOrientationTotalService = async () => {
    try {

        let totals = {
            pendingOrientation: 0,
            attended: 0,
            missed: 0,
            totalEvents: 0,
        };

        totals.pendingOrientation = await Applicants.count({ where: { orientationStatus: 'Pending' } });
        totals.attended = await Applicants.count({ where: { orientationStatus: 'Present' } });
        totals.missed = await Applicants.count({ where: { orientationStatus: 'Absent' } });
        totals.totalEvents = await OrientationEvents.count();

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

// FETCH ALL MONTH ORIENTATION EVENT 
export const fetchAllMonthOrientationEventService = async (
    monthDay = ''
) => {
    try {

        let whereCondition = {};

        // FILTER BY MONTH (optional)
        if (monthDay) {
            const startDate = new Date(`${monthDay}-01`);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            whereCondition.eventAt = {
                [Op.gte]: startDate,
                [Op.lt]: endDate,
            };
        }

        const orientationEvents = await OrientationEvents.findAll({
            where: whereCondition,
            attributes: [
                'id',
                'eventTitle',
                'location',
                'eventAt',
                'note'
            ],
            include: {
                model: Applicants,
                attributes: [
                    'firstName',
                    'lastName',
                    'orientationStatus'
                ]
            },
            order: [['eventAt', 'DESC']],
        });

        return {
            success: true,
            orientationEvents,
        };

    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: error.message,
        };
    }
};

// CHANGE EVENT
export const changeEventService = async (applicantId, orientationId) => {
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
            orientationId,
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
            eventAt: event.eventAt,
            location: event.location,
            eventMode: event.eventMode,
        });

        const message = `Updated Schedule Details:
${scheduleSummary}

Notes:
${event?.note}

Please make sure to take note of the updated schedule and attend on time. Candidates who are present will proceed with the hiring process, while those who are unable to attend may be considered not selected.`;
        if (event) {
            const notification = await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);
        }

        await sendMail({
            to: applicant.user.email,
            subject: `Orientation Scheduled – ${applicant?.job?.jobTitle}`,
            html: changeEventHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary,
                eventNote: event?.note
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