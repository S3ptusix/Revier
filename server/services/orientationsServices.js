import { col, fn, Op, where } from "sequelize";
import { Applicants, Companies, Jobs, Notification, OrientationEvents, Users } from "../models/index.js";
import { convertPHToUTC, convertUTCToPH, formatDateTime, renderMessageWithLinks } from "../utils/format.js";
import { io } from "../server.js";
import { sendMail } from "../utils/mailer.js";
import { forOrientationHTML } from "../emailTemplates/interviewTemplates.js";
import { absentOnOrientationHTML, addToEventHTML, changeEventHTML, hiredHTML, removedFromEventHTML } from "../emailTemplates/orientationTemplates.js";
import { buildScheduleSummary } from "../utils/messageBuilder.js";
import { getCompanyScope } from '../utils/getCompanyScope.js';

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

// FETCH ALL UPCOMING ORIENTATION EVENTS
export const fetchAllOrientationEventService = async (page = 1) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const now = new Date(); // current date & time

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
                where: {
                    eventAt: {
                        [Op.gte]: now // 🔥 only future events
                    }
                },
                limit,
                offset,
                order: [['eventAt', 'ASC']], // upcoming first
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

// FETCH ALL UPCOMING ORIENTATION EVENTS (CHANGE EVENT)
export const fetchAllOrientationEventCEService = async (
    applicantId = null,
    page = 1
) => {
    try {
        const limit = 10;
        const offset = (page - 1) * limit;

        const now = new Date(); // ✅ UTC-safe

        // Get the applicant's current orientation event
        const applicant = await Applicants.findByPk(applicantId, {
            attributes: ['orientationId']
        });

        // Build dynamic where condition
        const whereCondition = {
            eventAt: {
                [Op.gte]: now // 🔥 remove past events
            }
        };

        // Exclude current event if exists
        if (applicant?.orientationId) {
            whereCondition.id = {
                [Op.ne]: applicant.orientationId
            };
        }

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
                where: whereCondition,
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
                order: [['eventAt', 'ASC']], // 🔥 upcoming first
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
    page = 1,
    role,
    adminId
) => {
    try {
        search = search.trim();

        const limit = 10;
        const offset = (page - 1) * limit;

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

        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) {
            return {
                success: true,
                applicants: [],
                pagination: { total: 0, totalPages: 0 }
            };
        }

        // ---- STEP 1a: count matching applicants (no order needed, no GROUP BY headaches) ----
        const count = await Applicants.count({
            include: [
                {
                    model: Jobs,
                    as: 'job',
                    attributes: [],
                    where: jobWhereClause,
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
            distinct: true,
            col: 'id'
        });

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

        // ---- STEP 1b: get paginated, ordered applicant IDs ----
        const idRows = await Applicants.findAll({
            attributes: ['id'],
            include: [
                {
                    model: Users,
                    as: 'user',
                    attributes: [],
                    required: false
                },
                {
                    model: OrientationEvents,
                    as: 'orientationEvent',
                    attributes: [],
                    paranoid: false,
                    required: false
                },
                {
                    model: Jobs,
                    as: 'job',
                    attributes: [],
                    where: jobWhereClause,
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
            limit,
            offset,
            order: [
                [{ model: OrientationEvents, as: 'orientationEvent' }, 'eventAt', 'ASC']
            ],
            subQuery: false
        });

        if (idRows.length === 0) {
            return {
                success: true,
                applicants: [],
                pagination: {
                    total: count,
                    totalPages
                }
            };
        }

        const idOrder = idRows.map(r => r.id);

        // ---- STEP 2: hydrate full data for just those IDs ----
        let applicants = await Applicants.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'orientationStatus',
                'blacklistedReason',
                'orientationId'
            ],
            where: {
                id: idOrder
            },
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
                    attributes: [
                        'eventTitle',
                        'location',
                        'eventAt',
                        'eventMode'
                    ],
                    paranoid: false
                },
                {
                    model: Jobs,
                    as: "job",
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

// FETCH ALL APPLICANTS FROM ORIENTATION
export const fetchAllApplicantsFromOrientationService = async (
    orientationId,
    role,
    adminId
) => {
    try {
        const scope = await getCompanyScope(role, adminId);
        if (scope.error) return { success: false, message: scope.error };
        if (scope.empty) return { success: true, applicants: [] };

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
                    attributes: ['jobTitle'],
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
                },
                {
                    model: OrientationEvents,
                    as: 'orientationEvent',
                    attributes: [
                        'eventAt',
                    ]
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

        // ✅ VALIDATION
        if (
            isNaN(applicantId) ||
            !orientationStatus?.trim()
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        // ✅ GET APPLICANT
        const applicant = await Applicants.findByPk(applicantId);

        if (!applicant) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        // 🚫 PREVENT DOUBLE UPDATE
        if (['Present', 'Absent'].includes(applicant.orientationStatus)) {
            return {
                success: false,
                message: "Orientation status already finalized."
            };
        }

        // ✅ GET ORIENTATION EVENT
        const orientation = await OrientationEvents.findByPk(applicant.orientationId);

        if (!orientation) {
            return {
                success: false,
                message: "Orientation event not found."
            };
        }

        // 🚫 BLOCK IF EVENT IS STILL UPCOMING
        const now = new Date();
        const eventDate = new Date(orientation.eventAt);
        if (eventDate > now) {
            return {
                success: false,
                message: "Cannot update status before the orientation schedule."
            };
        }

        // =========================
        // ✅ HANDLE STATUS LOGIC
        // =========================

        if (orientationStatus === 'Present') {

            const job = await Jobs.findByPk(applicant.jobId);

            if (!job || job.slot <= 0) {
                return {
                    success: false,
                    message: 'No slots available for this job. Cannot hire applicant.'
                };
            }

            // decrement slot
            await Jobs.decrement('slot', {
                by: 1,
                where: { id: applicant.jobId }
            });

            // update applicant → HIRED
            await Applicants.update({
                applicantStatus: 'Hired',
                hiredAt: new Date(),
                orientationStatus
            }, {
                where: { id: applicantId }
            });

        } else if (orientationStatus === 'Absent') {

            // update applicant → REJECTED
            await Applicants.update({
                isRejected: true,
                rejectedAt: new Date(),
                rejectedReason: 'No Show',
                rejectedReasonNote: 'The candidate did not attend the scheduled orientation without prior notice.',
                orientationStatus
            }, {
                where: { id: applicantId }
            });

        } else {
            // fallback → Pending (no major action)
            await Applicants.update({
                orientationStatus
            }, {
                where: { id: applicantId }
            });
        }

        // =========================
        // ✅ FETCH UPDATED DATA
        // =========================
        const updatedApplicant = await Applicants.findByPk(applicantId, {
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
                    attributes: ['eventTitle']
                }
            ]
        });

        const firstName = updatedApplicant?.user?.firstName;
        const jobTitle = updatedApplicant?.job?.jobTitle;
        const companyName = updatedApplicant?.job?.company?.companyName;

        let message = '';

        // =========================
        // ✅ EMAIL + MESSAGE
        // =========================
        if (orientationStatus === 'Present') {

            message = `We are pleased to inform you that you have been successfully selected for the ${jobTitle} position at ${companyName}.

The company will contact you soon regarding your onboarding and next steps.

Congratulations and we wish you success in your new role!`;

            await sendMail({
                to: updatedApplicant.user.email,
                subject: `Job Offer Confirmation – ${jobTitle}`,
                html: hiredHTML({
                    firstName,
                    jobTitle,
                    companyName
                })
            });

        } else if (orientationStatus === 'Absent') {

            message = `You were marked as Absent during your scheduled orientation for the ${jobTitle} position at ${companyName}.

As attendance is required, your application will no longer proceed.

Thank you for your interest, and we encourage you to apply again in the future.`;

            await sendMail({
                to: updatedApplicant.user.email,
                subject: `Application Update – ${jobTitle}`,
                html: absentOnOrientationHTML({
                    firstName,
                    jobTitle,
                    companyName
                })
            });
        }

        // =========================
        // ✅ NOTIFICATION
        // =========================
        const notification = await Notification.create({
            userId: updatedApplicant?.userId,
            title: jobTitle,
            subTitle: companyName,
            message,
            type: orientationStatus === 'Present' ? 'success' : 'error'
        });

        // socket events
        io.to(`admins`).emit("dashboard");
        io.to(`user_${updatedApplicant.userId}`).emit("newNotification", notification);

        return {
            success: true,
            message: "Orientation status updated successfully."
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

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
                    attributes: ['eventTitle']
                },

                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                }
            ]
        });

        if (!applicant) {
            return {
                success: false,
                message: "Applicant not found."
            };
        }

        await Applicants.update({
            orientationId: null,
            orientationStatus: null
        }, {
            where: { id: applicantId }
        });

        const jobTitle = applicant?.job?.jobTitle;
        const companyName = applicant?.job?.company?.companyName;
        const eventTitle = applicant?.orientationEvent?.eventTitle;

        const message = `Orientation Update

You've been removed from an orientation session.

You have been removed from the "${eventTitle}" orientation for the ${jobTitle} position at ${companyName}. Please check your dashboard for updated scheduling details.

Please check your dashboard for updated scheduling details. If a new orientation date is available, you'll be notified as soon as it's confirmed.`;

        const notification = await Notification.create({
            userId: applicant?.userId,
            title: jobTitle,
            subTitle: companyName,
            message
        });

        io.to(`user_${applicant.userId}`).emit("newNotification", notification);

        // Send email notification, if we have an address to send to.
        if (applicant?.user?.email) {
            await sendMail({
                to: applicant.user.email,
                subject: `Orientation Update - ${jobTitle}`,
                html: removedFromEventHTML({
                    firstName: applicant.user.firstName,
                    jobTitle,
                    companyName,
                    eventTitle
                })
            });
        }

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
                        scheduleSummary: renderMessageWithLinks(scheduleSummary),
                        eventNote: renderMessageWithLinks(event?.note)
                    })
                });

            } catch (error) {
                // ❗ Don't break entire process if one fails
                console.error(`❌ Failed to notify user ${applicant.userId}`, error);
            }
        })
    );
};

// EDIT ORIENTATION EVENT
export const editOrientationEventService = async (
    orientationId,
    eventTitle,
    eventMode,
    location,
    eventAt,
    note
) => {
    try {

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
                message: "All fields are required"
            };
        }

        // 🚫 CHECK IF THERE ARE ACTIVE APPLICANTS
        const hasApplicants = await Applicants.findOne({
            where: {
                orientationId: orientationId,
                orientationStatus: {
                    [Op.ne]: null
                }
            }
        });

        if (hasApplicants) {
            return {
                success: false,
                message: "Cannot edit orientation event with active applicants."
            };
        }

        // ✅ PROCEED WITH UPDATE
        const [updatedRows] = await OrientationEvents.update(
            {
                eventTitle,
                eventMode,
                location,
                eventAt: convertPHToUTC(eventAt),
                note
            },
            {
                where: { id: orientationId }
            }
        );

        if (updatedRows === 0) {
            return {
                success: false,
                message: "Orientation event not found"
            };
        }

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
            eventAt: convertUTCToPH(event.eventAt),
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
            order: [['eventAt', 'ASC']],
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
                scheduleSummary: renderMessageWithLinks(scheduleSummary),
                eventNote: renderMessageWithLinks(event?.note)
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

// ADD TO EVENT
export const AddToEventService = async (applicantId, orientationId) => {
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

        const message = `You’ve Been Added to an Event
        
Here are your orientation details.
${scheduleSummary}

Notes:
${event?.note}

Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.`;

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
            html: addToEventHTML({
                firstName: applicant?.user?.firstName,
                jobTitle: applicant?.job?.jobTitle,
                companyName: applicant?.job?.company?.companyName,
                scheduleSummary: renderMessageWithLinks(scheduleSummary),
                eventNote: renderMessageWithLinks(event?.note)
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

// BULK MOVE TO EVENT
export const bulkMoveToEventService = async (applicantIds, orientationId) => {
    try {
        if (!Array.isArray(applicantIds) || applicantIds.length === 0 || isNaN(orientationId)) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }


        orientationId = Number(orientationId);

        // 1. Snapshot current state BEFORE updating, so we know who's actually changing
        const beforeUpdate = await Applicants.findAll({
            where: { id: applicantIds },
            attributes: ['id', 'orientationId']
        });

        const changedApplicantIds = beforeUpdate
            .filter(a => a.orientationId !== orientationId)
            .map(a => a.id);

        const unchangedCount = applicantIds.length - changedApplicantIds.length;

        // Nothing to do
        if (changedApplicantIds.length === 0) {
            return {
                success: true,
                message: "No changes made — selected applicants are already in this event.",
                results: []
            };
        }

        // 2. Update everyone (or just changedApplicantIds — same result, but this keeps the where-clause simple)
        await Applicants.update(
            { orientationId },
            { where: { id: changedApplicantIds } }
        );

        // 3. Only fetch/notify/email applicants whose event actually changed
        const applicants = await Applicants.findAll({
            where: { id: changedApplicantIds },
            attributes: ['id', 'userId'],
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
                    attributes: ['eventTitle', 'location', 'eventAt', 'eventMode', 'note']
                }
            ]
        });

        const results = [];

        for (const applicant of applicants) {
            const event = applicant?.orientationEvent;

            if (!event) {
                results.push({ applicantId: applicant.id, success: false, message: "No event found" });
                continue;
            }

            try {
                const scheduleSummary = buildScheduleSummary({
                    eventTitle: event.eventTitle,
                    eventAt: event.eventAt,
                    location: event.location,
                    eventMode: event.eventMode,
                });

                const message = `Updated Schedule Details:
${scheduleSummary}

Notes:
${event.note ?? "—"}

Please make sure to take note of the updated schedule and attend on time. Candidates who are present will proceed with the hiring process, while those who are unable to attend may be considered not selected.`;

                const notification = await Notification.create({
                    userId: applicant.userId,
                    title: applicant?.job?.jobTitle,
                    subTitle: applicant?.job?.company?.companyName,
                    message
                });

                io.to(`user_${applicant.userId}`).emit("newNotification", notification);

                await sendMail({
                    to: applicant.user.email,
                    subject: `Orientation Scheduled – ${applicant?.job?.jobTitle}`,
                    html: changeEventHTML({
                        firstName: applicant?.user?.firstName,
                        jobTitle: applicant?.job?.jobTitle,
                        companyName: applicant?.job?.company?.companyName,
                        scheduleSummary: renderMessageWithLinks(scheduleSummary),
                        eventNote: renderMessageWithLinks(event.note)
                    })
                });

                results.push({ applicantId: applicant.id, success: true });
            } catch (innerError) {
                results.push({ applicantId: applicant.id, success: false, message: innerError.message });
            }
        }

        return {
            success: true,
            results,
            skipped: unchangedCount // how many were already in this event, no-op'd
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// BULK REMOVE FROM EVENT
export const bulkRemoveFromEventService = async (applicantIds) => {
    try {
        if (!Array.isArray(applicantIds) || applicantIds.length === 0) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicants = await Applicants.findAll({
            where: { id: applicantIds },
            attributes: ['id', 'userId', 'orientationId'],
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
                    as: 'orientationEvent',
                    attributes: ['eventTitle']
                },
                {
                    model: Users,
                    as: 'user',
                    attributes: ['email', 'firstName']
                }
            ]
        });

        if (!applicants.length) {
            return {
                success: false,
                message: "Applicant(s) not found."
            };
        }

        // Only applicants that actually had an orientation assigned
        const applicantsWithOrientation = applicants.filter(a => a.orientationId != null);

        // Clear orientation fields for all matched applicants in one query
        // (still clear for all matched IDs, in case some have stray orientationStatus without orientationId, etc.)
        await Applicants.update(
            { orientationId: null, orientationStatus: null },
            { where: { id: applicants.map(a => a.id) } }
        );

        // Process notifications/emails only for applicants who had an orientation
        for (const applicant of applicantsWithOrientation) {
            const jobTitle = applicant?.job?.jobTitle;
            const companyName = applicant?.job?.company?.companyName;
            const eventTitle = applicant?.orientationEvent?.eventTitle;

            const message = `Orientation Update

You've been removed from an orientation session.

You have been removed from the "${eventTitle}" orientation for the ${jobTitle} position at ${companyName}. Please check your dashboard for updated scheduling details.

If a new orientation date is available, you'll be notified as soon as it's confirmed.`;

            const notification = await Notification.create({
                userId: applicant?.userId,
                title: jobTitle,
                subTitle: companyName,
                message
            });

            io.to(`user_${applicant.userId}`).emit("newNotification", notification);

            if (applicant?.user?.email) {
                await sendMail({
                    to: applicant.user.email,
                    subject: `Orientation Update - ${jobTitle}`,
                    html: removedFromEventHTML({
                        firstName: applicant.user.firstName,
                        jobTitle,
                        companyName,
                        eventTitle
                    })
                });
            }
        }

        return { success: true };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// BULK EDIT ORIENTATION STATUS
export const bulkEditOrientationStatusService = async (applicantIds, orientationStatus) => {
    try {
        const VALID_STATUSES = ['Present', 'Absent'];

        if (
            !Array.isArray(applicantIds) ||
            applicantIds.length === 0 ||
            !VALID_STATUSES.includes(orientationStatus)
        ) {
            return {
                success: false,
                message: "Please complete all required fields."
            };
        }

        const applicants = await Applicants.findAll({
            where: { id: applicantIds },
            attributes: ['id', 'userId', 'firstName', 'lastName', 'jobId', 'orientationId', 'orientationStatus']
        });

        if (!applicants.length) {
            return {
                success: false,
                message: "Applicant(s) not found."
            };
        }

        const results = [];

        for (const applicant of applicants) {

            // 🚫 Skip applicants with no orientation assigned in the first place
            if (!applicant.orientationId) {
                results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: false, message: "No orientation assigned." });
                continue;
            }

            // 🚫 PREVENT DOUBLE UPDATE
            if (['Present', 'Absent'].includes(applicant.orientationStatus)) {
                results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: false, message: "Orientation status already finalized." });
                continue;
            }

            // ✅ GET ORIENTATION EVENT
            const orientation = await OrientationEvents.findByPk(applicant.orientationId);
            if (!orientation) {
                results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: false, message: "Orientation event not found." });
                continue;
            }

            // 🚫 BLOCK IF EVENT IS STILL UPCOMING
            const now = new Date();
            if (new Date(orientation.eventAt) > now) {
                results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: false, message: "Cannot update status before the orientation schedule." });
                continue;
            }

            // =========================
            // ✅ HANDLE STATUS LOGIC
            // =========================
            if (orientationStatus === 'Present') {

                // Re-fetch fresh each iteration so concurrent decrements in this
                // same loop (e.g. two applicants on the same job) are respected
                const job = await Jobs.findByPk(applicant.jobId);

                if (!job || job.slot <= 0) {
                    results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: false, message: "No slots available for this job. Cannot hire applicant." });
                    continue;
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
                    where: { id: applicant.id }
                });

            } else if (orientationStatus === 'Absent') {

                await Applicants.update({
                    isRejected: true,
                    rejectedAt: new Date(),
                    rejectedReason: 'No Show',
                    rejectedReasonNote: 'The candidate did not attend the scheduled orientation without prior notice.',
                    orientationStatus
                }, {
                    where: { id: applicant.id }
                });

            }

            // =========================
            // ✅ FETCH UPDATED DATA
            // =========================
            const updatedApplicant = await Applicants.findByPk(applicant.id, {
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
                        attributes: ['eventTitle']
                    }
                ]
            });

            const firstName = updatedApplicant?.user?.firstName;
            const jobTitle = updatedApplicant?.job?.jobTitle;
            const companyName = updatedApplicant?.job?.company?.companyName;

            let message = '';

            // =========================
            // ✅ EMAIL + MESSAGE
            // =========================
            if (orientationStatus === 'Present') {

                message = `We are pleased to inform you that you have been successfully selected for the ${jobTitle} position at ${companyName}.

The company will contact you soon regarding your onboarding and next steps.

Congratulations and we wish you success in your new role!`;

                if (updatedApplicant?.user?.email) {
                    await sendMail({
                        to: updatedApplicant.user.email,
                        subject: `Job Offer Confirmation – ${jobTitle}`,
                        html: hiredHTML({
                            firstName,
                            jobTitle,
                            companyName
                        })
                    });
                }

            } else if (orientationStatus === 'Absent') {

                message = `You were marked as Absent during your scheduled orientation for the ${jobTitle} position at ${companyName}.

As attendance is required, your application will no longer proceed.

Thank you for your interest, and we encourage you to apply again in the future.`;

                if (updatedApplicant?.user?.email) {
                    await sendMail({
                        to: updatedApplicant.user.email,
                        subject: `Application Update – ${jobTitle}`,
                        html: absentOnOrientationHTML({
                            firstName,
                            jobTitle,
                            companyName
                        })
                    });
                }
            }

            // =========================
            // ✅ NOTIFICATION
            // =========================
            // Only notify when there's an actual message (skip silent "Pending" fallback)
            if (message) {
                const notification = await Notification.create({
                    userId: updatedApplicant?.userId,
                    title: jobTitle,
                    subTitle: companyName,
                    message,
                    type: orientationStatus === 'Present' ? 'success' : 'error'
                });

                io.to(`user_${updatedApplicant.userId}`).emit("newNotification", notification);
            }

            results.push({ name: `${applicant.firstName} ${applicant.lastName}`, success: true });
        }

        io.to(`admins`).emit("dashboard");

        return {
            success: true,
            message: "Orientation status update processed.",
            results
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};