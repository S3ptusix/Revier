import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import {
    createEventController,
    deleteOrientationController,
    editOrientationEventController,
    editOrientationStatusController,
    fetchAllApplicantsFromOrientationController,
    fetchAllMonthOrientationEventController,
    fetchAllOrientationController,
    fetchAllOrientationEventCEController,
    fetchAllOrientationEventController,
    fetchOneOrientationEventController,
    fetchOrientationTotalController,
    removeFromEventController
} from '../controllers/orientationsControllers.js';

const orientationsRouter = express.Router();

// CREATE ORIENTATION EVENT
orientationsRouter.post('/create', authenticateAdminJWT, createEventController);

// FETCH ONE ORIENTATION EVENT
orientationsRouter.get('/fetchOne/:orientationId', authenticateAdminJWT, fetchOneOrientationEventController);

// FETCH ALL ORIENTATION EVENT
orientationsRouter.get('/fetchAll/events', authenticateAdminJWT, fetchAllOrientationEventController);

// FETCH ALL ORIENTATION EVENT (CHANGE EVENT)
orientationsRouter.get('/fetchAll/events/change', authenticateAdminJWT, fetchAllOrientationEventCEController);

// FETCH ALL ORIENTATIONS
orientationsRouter.get('/fetchAll/applicants', authenticateAdminJWT, fetchAllOrientationController);

// FETCH ALL APPLICANTS FROM ORIENTATION
orientationsRouter.get('/fetchAll/applicantsFromOrientation/:orientationId', authenticateAdminJWT, fetchAllApplicantsFromOrientationController);

// EDIT ORIENTATION STATUS
orientationsRouter.put('/edit/orientationStatus/:applicantId', authenticateAdminJWT, editOrientationStatusController);

// DELETE ORIENTATION 
orientationsRouter.delete('/delete/:orientationId', authenticateAdminJWT, deleteOrientationController);

// REMOVE FROM EVENT 
orientationsRouter.put('/removeFromEvent/:applicantId', authenticateAdminJWT, removeFromEventController);

// EDIT ORIENTATION EVENT 
orientationsRouter.put('/edit/:orientationId', authenticateAdminJWT, editOrientationEventController);

// FETCH ORIENTATION TOTALS
orientationsRouter.get('/totals', authenticateAdminJWT, fetchOrientationTotalController);

// FETCH ALL MONTH ORIENTATION EVENT
orientationsRouter.get('/events/month/fetchAll', authenticateAdminJWT, fetchAllMonthOrientationEventController);

export default orientationsRouter;