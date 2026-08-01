import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { blacklistController, fetchBlacklistReasonController } from '../controllers/blacklistControllers.js';

const blacklistRouter = express.Router();

// BLACKLIST
blacklistRouter.put('/blacklist/:applicantId', authenticateAdminJWT, blacklistController);

// FETCH BLACKLIST REASON
blacklistRouter.get('/fetchBlacklistReason/:applicantId', authenticateAdminJWT, fetchBlacklistReasonController);

export default blacklistRouter;

