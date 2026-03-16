import { Op } from "sequelize";
import { Applicants, Companies, Jobs, OrientationEvents, Users } from "../models/index.js";

// CREATE ORIENTATION EVENT
export const createEventService = async (
    eventTitle,
    location,
    eventAt,
    note
) => {
    try {

        if (!eventTitle.trim()) {
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
        const orientation = await OrientationEvents.findAll({
            attributes: [
                'eventTitle',
                'location',
                'eventAt',
                'note'
            ],
            where: {
                id: orientationId
            }
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
export const fetchAllOrientationEventService = async () => {
    try {
        const orientationEvents = await OrientationEvents.findAll({
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
                    'fullname',
                    'orientationStatus'
                ]
            }
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

// FETCH ALL ORIENTATIONS
export const fetchAllOrientationService = async (orientationStatus) => {
    try {

        const whereClause = {
            applicantStatus: 'Orientation',
            isRejected: 'No'
        };

        if (orientationStatus) {
            whereClause.orientationStatus = orientationStatus;
        }

        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
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
                    include: [
                        {
                            model: Companies,
                            as: 'company',
                            attributes: ['companyName']
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

// FETCH ALL APPLICANTS FROM ORIENTATION
export const fetchAllApplicantsFromOrientationService = async (orientationId) => {
    try {
        const applicants = await Applicants.findAll({
            attributes: [
                'id',
                'fullname',
                'orientationStatus',
                'applicantStatus'
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

        console.log({ applicantId, orientationId });

        await Applicants.update({
            orientationId,
            orientationStatus: 'Pending'
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


        await Applicants.update({
            orientationStatus
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

        if (isNaN(orientationId) || !eventTitle.trim()) {
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