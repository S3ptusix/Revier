import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllHiredController } from '../controllers/hiredControllers.js';
import { hiredGeneralLimiter } from '../middleware/rateLimiter/hiredRateLimiter.js';

const hiredRouter = express.Router();

// FETCH ALL HIRED
hiredRouter.get('/fetchAll', hiredGeneralLimiter, authenticateAdminJWT, fetchAllHiredController);


export default hiredRouter;
