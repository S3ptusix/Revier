import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllHiredController, fetchHiredTotalController } from '../controllers/hiredControllers.js';

const hiredRouter = express.Router();

// FETCH ALL HIRED
hiredRouter.get('/fetchAll', authenticateAdminJWT, fetchAllHiredController);

// FETCH HIRED TOTALS
hiredRouter.get('/totals', authenticateAdminJWT, fetchHiredTotalController);


export default hiredRouter;