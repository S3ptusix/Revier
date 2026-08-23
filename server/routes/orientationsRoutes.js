import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import {
    AddToEventController,
    bulkEditOrientationStatusController,
    bulkMoveToEventController,
    bulkRemoveFromEventController,
    changeEventController,
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
import { orientationBulkLimiter, orientationGeneralLimiter, orientationWriteLimiter } from '../middleware/rateLimiter/orientationsRateLimiter.js';

const orientationsRouter = express.Router();

// CREATE ORIENTATION EVENT
orientationsRouter.post('/create', orientationWriteLimiter, authenticateAdminJWT, createEventController);

// FETCH ONE ORIENTATION EVENT
orientationsRouter.get('/fetchOne/:orientationId', orientationGeneralLimiter, authenticateAdminJWT, fetchOneOrientationEventController);

// FETCH ALL ORIENTATION EVENT
orientationsRouter.get('/fetchAll/events', orientationGeneralLimiter, authenticateAdminJWT, fetchAllOrientationEventController);

// FETCH ALL ORIENTATION EVENT (CHANGE EVENT)
orientationsRouter.get('/fetchAll/events/change', orientationGeneralLimiter, authenticateAdminJWT, fetchAllOrientationEventCEController);

// FETCH ALL ORIENTATIONS
orientationsRouter.get('/fetchAll/applicants', orientationGeneralLimiter, authenticateAdminJWT, fetchAllOrientationController);

// FETCH ALL APPLICANTS FROM ORIENTATION
orientationsRouter.get('/fetchAll/applicantsFromOrientation/:orientationId', orientationGeneralLimiter, authenticateAdminJWT, fetchAllApplicantsFromOrientationController);

// EDIT ORIENTATION STATUS
orientationsRouter.put('/edit/orientationStatus/:applicantId', orientationWriteLimiter, authenticateAdminJWT, editOrientationStatusController);

// DELETE ORIENTATION 
orientationsRouter.delete('/delete/:orientationId', orientationWriteLimiter, authenticateAdminJWT, deleteOrientationController);

// REMOVE FROM EVENT 
orientationsRouter.put('/removeFromEvent/:applicantId', orientationWriteLimiter, authenticateAdminJWT, removeFromEventController);

// EDIT ORIENTATION EVENT 
orientationsRouter.put('/edit/:orientationId', orientationWriteLimiter, authenticateAdminJWT, editOrientationEventController);

// FETCH ORIENTATION TOTALS
orientationsRouter.get('/totals', orientationGeneralLimiter, authenticateAdminJWT, fetchOrientationTotalController);

// FETCH ALL MONTH ORIENTATION EVENT
orientationsRouter.get('/events/month/fetchAll', orientationGeneralLimiter, authenticateAdminJWT, fetchAllMonthOrientationEventController);

// CHANGE EVENT
orientationsRouter.put('/changeEvent/:applicantId', orientationWriteLimiter, authenticateAdminJWT, changeEventController);

// ADD TO EVENT
orientationsRouter.put('/addToEvent/:applicantId', orientationWriteLimiter, authenticateAdminJWT, AddToEventController);

// BULK CHANGE EVENT
orientationsRouter.put('/bulkMoveToEvent/:orientationId', orientationBulkLimiter, authenticateAdminJWT, bulkMoveToEventController);

// BULK REMOVE FROM EVENT 
orientationsRouter.put('/bulkRemoveFromEvent', orientationBulkLimiter, authenticateAdminJWT, bulkRemoveFromEventController);

// BULK EDIT ORIENTATION STATUS
orientationsRouter.put('/bulkEditOrientationStatus', orientationBulkLimiter, authenticateAdminJWT, bulkEditOrientationStatusController);

export default orientationsRouter;
