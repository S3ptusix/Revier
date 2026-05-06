import express from 'express';
import { createCompanyController, deleteCompanyController, fetchAllArchiveCompanyController, fetchAllCompanyController, fetchAllCompanySelectController, fetchCompanyTotalController, fetchOneCompanyController, restoreCompanyController, updateCompanyController } from '../controllers/companyControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const companyRouter = express.Router();

// CREATE COMPANY 
companyRouter.post('/create', authenticateAdminJWT, createCompanyController);

// FETCH ALL COMPANY
companyRouter.get('/select/fetchAll', authenticateAdminJWT, fetchAllCompanySelectController);

// FETCH ALL COMPANY
companyRouter.get('/fetchAll', authenticateAdminJWT, fetchAllCompanyController);

// FETCH ONE COMPANY
companyRouter.get('/fetchOne/:companyId', authenticateAdminJWT, fetchOneCompanyController);

// UPDATE COMPANY
companyRouter.put('/update/:companyId', authenticateAdminJWT, updateCompanyController);

// DELETE COMPANY
companyRouter.delete('/delete/:companyId', authenticateAdminJWT, deleteCompanyController);

// FETCH COMPANY TOTALS
companyRouter.get('/totals', authenticateAdminJWT, fetchCompanyTotalController);

// FETCH ALL ARCHIVE COMPANY
companyRouter.get('/archive/fetchAll', authenticateAdminJWT, fetchAllArchiveCompanyController);

// RESTORE COMPANY
companyRouter.put('/restore/:companyId', authenticateAdminJWT, restoreCompanyController);

export default companyRouter;