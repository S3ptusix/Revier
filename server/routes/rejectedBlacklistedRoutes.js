import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { blacklistController, fetchAllRejectedAndBlacklistedController, fetchBlacklistReasonController, fetchRejectedTotalController } from '../controllers/rejectedBlacklistedControllers.js';

const rejectedBlacklistedRouter = express.Router();

// FETCH ALL REJECTED AND BLACKLISTED
rejectedBlacklistedRouter.get('/fetchAll', authenticateAdminJWT, fetchAllRejectedAndBlacklistedController);

// FETCH BLACKLIST REASON
rejectedBlacklistedRouter.get('/fetch/blacklist/:applicantId', authenticateAdminJWT, fetchBlacklistReasonController);

// BLACKLIST
rejectedBlacklistedRouter.put('/blacklist/:applicantId', authenticateAdminJWT, blacklistController);

// FETCH REJECTED TOTALS
rejectedBlacklistedRouter.get('/totals', authenticateAdminJWT, fetchRejectedTotalController);

export default rejectedBlacklistedRouter;