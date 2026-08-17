import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllRejectedController } from '../controllers/rejectedControllers.js';

const rejectedRouter = express.Router();

// FETCH ALL REJECTED
rejectedRouter.get('/fetchAll', authenticateAdminJWT, fetchAllRejectedController);

export default rejectedRouter;