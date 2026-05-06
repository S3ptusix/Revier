import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { blacklistController, fetchAllRejectedAndBlacklistedController, fetchBlacklistReasonController, fetchRejectedTotalController } from '../controllers/rejectedControllers.js';

const rejectedRouter = express.Router();

// FETCH ALL REJECTED AND BLACKLISTED
rejectedRouter.get('/fetchAll', authenticateAdminJWT, fetchAllRejectedAndBlacklistedController);

// FETCH BLACKLIST REASON
rejectedRouter.get('/fetch/blacklist/:applicantId', authenticateAdminJWT, fetchBlacklistReasonController);

// BLACKLIST
rejectedRouter.put('/blacklist/:applicantId', authenticateAdminJWT, blacklistController);

// FETCH REJECTED TOTALS
rejectedRouter.get('/totals', authenticateAdminJWT, fetchRejectedTotalController);

export default rejectedRouter;