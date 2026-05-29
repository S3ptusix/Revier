import { col, fn, Op, where } from "sequelize";
import { Applicants, ApplicantStatusHistory, Companies, Jobs, Notification, OrientationEvents, Users } from "../models/index.js";
import { cleanDateTime, formatDateTime } from "../utils/format.js";

// CREATE ORIENTATION EVENT
export const createEventService = async (
    eventTitle,
    location,
    eventAt,
    note
) => {
    try {

        if (
            !eventTitle.trim() ||
            !location.trim() ||
            !eventAt.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await OrientationEvents.create({
            eventTitle,
            location,
            eventAt,
            note
        });

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

// FETCH ALL ORIENTATIONS
export const fetchAllOrientationService = async (
    search = "",
    companyId = '',
    page = 1
) => {
    try {
        const limit = 10;

        const whereClause = {
            applicantStatus: 'Orientation',
            isRejected: 'No'
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
                'orientationStatus',
                'blacklistedReason',
                'orientationId'
            ],
            include: [
                {
                    model: Users,
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

// ADD TO EVENT
export const addToEventService = async (applicantId, orientationId) => {
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
                        }
                    ]
                },
                {
                    model: OrientationEvents,
                    attributes: [
                        'eventTitle',
                        'location',
                        'eventAt',
                        'note'
                    ]
                }
            ]
        });

        const event = applicant?.orientationEvent;

        if (event) {
            await Notification.create({
                userId: applicant?.userId,
                title: applicant?.job?.jobTitle,
                subTitle: applicant?.job?.company?.companyName,
                message: `You're scheduled for an orientation for the ${applicant?.job?.jobTitle} position. 
                    Event: ${event.eventTitle}, 
                    Location: ${event.location}, 
                    Date & Time: ${formatDateTime(event.eventAt)}.${event.note ? ` Notes: ${event.note}` : ''
                    }`
            });
        }

        return { success: true }

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

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

            const thisApplicant = await Applicants.findByPk(applicantId);

            const job = await Jobs.findByPk(thisApplicant.jobId);

            if (job.slot <= 0) {
                return {
                    success: false,
                    message: 'No slots available for this job. cannot hire applicant.'
                }
            }

            await Jobs.decrement('slot', {
                by: 1,
                where: { id: thisApplicant.jobId }
            });

            await Applicants.update({
                applicantStatus: 'Hired',
                orientationStatus
            }, {
                where: { id: applicantId }
            });
            await ApplicantStatusHistory.create({
                applicantId,
                applicantStatus: 'Hired'
            });
        } else {
            await Applicants.update({
                isRejected: 'Yes',
                orientationStatus
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
            message: orientationStatus === 'Present'
                ? `🎉 You're officially hired! You’ve successfully completed your orientation (${applicant?.orientationEvent?.eventTitle}) for the ${applicant?.job?.jobTitle} position. Welcome aboard!`
                : `Application Update: You were marked as "${orientationStatus}" during your orientation (${applicant?.orientationEvent?.eventTitle}) for the ${applicant?.job?.jobTitle} position. Unfortunately, your application will not proceed further.`,
            type: orientationStatus === 'Present' ? 'success' : 'warning'
        });

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
                    attributes: ['jobTitle']
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
            message: `You have been removed from the "${applicant?.orientationEvent?.eventTitle}" orientation for the ${applicant?.job?.jobTitle} position.`
        });

        return { success: true };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

// EDIT ORIENTATION EVENT
export const editOrientationEventService = async (
    orientationId,
    eventTitle,
    location,
    eventAt,
    note
) => {
    try {

        if (
            isNaN(orientationId) ||
            !eventTitle.trim() ||
            !location.trim() ||
            !eventAt.trim()
        ) {
            return {
                success: false,
                message: "Please complete all fields."
            };
        }

        await OrientationEvents.update({
            eventTitle,
            location,
            eventAt,
            note
        }, {
            where: { id: orientationId }
        });

        return {
            success: true,
            message: "Orientation event updated successfully"
        }
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

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