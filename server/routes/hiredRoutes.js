import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllHiredController } from '../controllers/hiredControllers.js';

const hiredRouter = express.Router();

// FETCH ALL HIRED
hiredRouter.get('/fetchAll', authenticateAdminJWT, fetchAllHiredController);


export default hiredRouter;