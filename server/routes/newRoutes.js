import express from 'express';
import { fetchAllNewController } from '../controllers/newControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const newRouter = express.Router();

// FETCH ALL NEW
newRouter.get('/fetchAll/', authenticateAdminJWT, fetchAllNewController);

export default newRouter;