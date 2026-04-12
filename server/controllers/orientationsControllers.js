import { addToEventService, createEventService, deleteOrientationService, editOrientationEventService, editOrientationStatusService, fetchAllApplicantsFromOrientationService, fetchAllOrientationEventService, fetchAllOrientationService, fetchOneOrientationEventService, fetchOrientationTotalService, removeFromEventService } from "../services/orientationsServices.js";

// CREATE ORIENTATION EVENT
export const createEventController = async (req, res) => {
    try {
        const {
            eventTitle,
            location,
            eventAt,
            note
        } = req.body;
        const result = await createEventService
            (
                eventTitle,
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
        console.log(orientationId);
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

// ADD TO EVENT
export const addToEventController = async (req, res) => {
    try {
        const { applicantId } = req.params;
        const { orientationId } = req.body;

        const result = await addToEventService(applicantId, orientationId);

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
            location,
            eventAt,
            note
        } = req.body;

        const result = await editOrientationEventService(
            orientationId,
            eventTitle,
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
