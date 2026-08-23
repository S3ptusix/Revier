import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { blacklistController, fetchBlacklistReasonController } from '../controllers/blacklistControllers.js';
import { blacklistGeneralLimiter } from '../middleware/rateLimiter/blacklistRateLimiter.js';

const blacklistRouter = express.Router();

// BLACKLIST
blacklistRouter.put('/blacklist/:applicantId', blacklistGeneralLimiter, authenticateAdminJWT, blacklistController);

// FETCH BLACKLIST REASON
blacklistRouter.get('/fetchBlacklistReason/:applicantId', blacklistGeneralLimiter, authenticateAdminJWT, fetchBlacklistReasonController);

export default blacklistRouter;
