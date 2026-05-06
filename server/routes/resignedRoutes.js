import express from 'express';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { fetchAllResignedController, fetchResignedTotalController } from '../controllers/resignedControllers.js';

const resignedCRouter = express.Router();

// FETCH RESIGNED TOTALS
resignedCRouter.get('/totals', authenticateAdminJWT, fetchResignedTotalController);

// FETCH ALL RESIGNED 
resignedCRouter.get('/fetchAll', authenticateAdminJWT, fetchAllResignedController);

export default resignedCRouter;