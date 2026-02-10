import express from 'express';
import { createCompanyController, fetchAllCompanyController } from '../controllers/companyControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const companyRouter = express.Router();

// CREATE COMPANY 
companyRouter.post('/create', authenticateAdminJWT, createCompanyController);

// FETCH ALL COMPANY
companyRouter.get('/fetchAll', authenticateAdminJWT, fetchAllCompanyController);



export default companyRouter;