import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllRejectedController } from '../controllers/rejectedControllers.js';
import { rejectedGeneralLimiter } from '../middleware/rateLimiter/rejectedRateLimiter.js';

const rejectedRouter = express.Router();

// FETCH ALL REJECTED
rejectedRouter.get('/fetchAll', rejectedGeneralLimiter, authenticateAdminJWT, fetchAllRejectedController);

export default rejectedRouter;
