import {
    AddToEventService,
    changeEventService,
    createEventService,
    deleteOrientationService,
    editOrientationEventService,
    editOrientationStatusService,
    fetchAllApplicantsFromOrientationService,
    fetchAllMonthOrientationEventService,
    fetchAllOrientationEventCEService,
    fetchAllOrientationEventService,
    fetchAllOrientationService,
    fetchOneOrientationEventService,
    fetchOrientationTotalService,
    removeFromEventService
} from "../services/orientationsServices.js";

// CREATE ORIENTATION EVENT
export const createEventController = async (req, res) => {
    try {
        const {
            eventTitle,
            eventMode,
            location,
            eventAt,
            note
        } = req.body;
        const result = await createEventService
            (
                eventTitle,
                eventMode,
                location,
                eventAt,
                note
            );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ONE ORIENTATION EVENT
export const fetchOneOrientationEventController = async (req, res) => {
    try {
        const { orientationId } = req.params;
        const result = await fetchOneOrientationEventService(orientationId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL ORIENTATION EVENT
export const fetchAllOrientationEventController = async (req, res) => {
    try {
        const { page } = req.query;
        const result = await fetchAllOrientationEventService(page);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL ORIENTATION EVENT (CHANGE EVENT)
export const fetchAllOrientationEventCEController = async (req, res) => {
    try {
        const { applicantId, page } = req.query;
        const result = await fetchAllOrientationEventCEService(applicantId, page);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL ORIENTATIONS
export const fetchAllOrientationController = async (req, res) => {
    try {
        const {
            search,
            companyId,
            page
        } = req.query;
        const result = await fetchAllOrientationService(
            search,
            companyId,
            page
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL APPLICANTS FROM ORIENTATION
export const fetchAllApplicantsFromOrientationController = async (req, res) => {
    try {
        const { orientationId } = req.params;
        const result = await fetchAllApplicantsFromOrientationService(orientationId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT ORIENTATION STATUS
export const editOrientationStatusController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { orientationStatus } = req.body;

        const result = await editOrientationStatusService(applicantId, orientationStatus);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// DELETE ORIENTATION 
export const deleteOrientationController = async (req, res) => {
    try {
        const { orientationId } = req.params;

        const result = await deleteOrientationService(orientationId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// REMOVE FROM EVENT 
export const removeFromEventController = async (req, res) => {
    try {
        const { applicantId } = req.params;

        const result = await removeFromEventService(applicantId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// EDIT ORIENTATION EVENT 
export const editOrientationEventController = async (req, res) => {
    try {
        const { orientationId } = req.params;
        const {
            eventTitle,
            eventMode,
            location,
            eventAt,
            note
        } = req.body;

        const result = await editOrientationEventService(
            orientationId,
            eventTitle,
            eventMode,
            location,
            eventAt,
            note
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ORIENTATION TOTALS
export const fetchOrientationTotalController = async (req, res) => {
    try {

        const result = await fetchOrientationTotalService();

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// FETCH ALL MONTH ORIENTATION EVENT
export const fetchAllMonthOrientationEventController = async (req, res) => {
    try {
        const { monthDay } = req.query;
        const result = await fetchAllMonthOrientationEventService(monthDay);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// CHANGE EVENT
export const changeEventController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { orientationId } = req.body;
        const result = await changeEventService(applicantId, orientationId);


        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}

// ADD TO EVENT
export const AddToEventController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { orientationId } = req.body;

        const result = await AddToEventService(applicantId, orientationId);

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.json({
            success: false,
            message: error.message
        });
    }
}
