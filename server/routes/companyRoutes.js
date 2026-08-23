import express from 'express';
import { createCompanyController, deleteCompanyController, fetchAllArchiveCompanyController, fetchAllCompanyController, fetchAllCompanySelectController, fetchCompanyTotalController, fetchOneCompanyController, restoreCompanyController, updateCompanyController } from '../controllers/companyControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { companyGeneralLimiter, companyWriteLimiter } from '../middleware/rateLimiter/companyRateLimiter.js';

const companyRouter = express.Router();

// CREATE COMPANY 
companyRouter.post('/create', companyWriteLimiter, authenticateAdminJWT, createCompanyController);

// FETCH ALL COMPANY SELECT
companyRouter.get('/select/fetchAll', companyGeneralLimiter, authenticateAdminJWT, fetchAllCompanySelectController);

// FETCH ALL COMPANY
companyRouter.get('/fetchAll', companyGeneralLimiter, authenticateAdminJWT, fetchAllCompanyController);

// FETCH ONE COMPANY
companyRouter.get('/fetchOne/:companyId', companyGeneralLimiter, authenticateAdminJWT, fetchOneCompanyController);

// UPDATE COMPANY
companyRouter.put('/update/:companyId', companyWriteLimiter, authenticateAdminJWT, updateCompanyController);

// DELETE COMPANY
companyRouter.delete('/delete/:companyId', companyWriteLimiter, authenticateAdminJWT, deleteCompanyController);

// FETCH COMPANY TOTALS
companyRouter.get('/totals', companyGeneralLimiter, authenticateAdminJWT, fetchCompanyTotalController);

// FETCH ALL ARCHIVE COMPANY
companyRouter.get('/archive/fetchAll', companyGeneralLimiter, authenticateAdminJWT, fetchAllArchiveCompanyController);

// RESTORE COMPANY
companyRouter.put('/restore/:companyId', companyWriteLimiter, authenticateAdminJWT, restoreCompanyController);

export default companyRouter;
