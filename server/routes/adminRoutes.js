import express from 'express';
import { adminRegistrationController, deleteAdminController, editAdminController, fetchAdminController, fetchAdminTotalController, fetchAllAdminController, fetchOneAdminController, loginAdminController, logoutAdminController } from '../controllers/adminControllers.js';
import { authenticateAdminJWT, authorizeRoles } from '../middleware/auth.js';

const adminRouter = express.Router();

// REGISTER ADMIN 
adminRouter.post('/register', authenticateAdminJWT, authorizeRoles('HR Manager'), adminRegistrationController);

// LOGIN ADMIN 
adminRouter.post('/login', loginAdminController);

// LOGOUT ADMIN
adminRouter.get('/logout', authenticateAdminJWT, logoutAdminController);

// FETCH ADMIN
adminRouter.get('/fetch', authenticateAdminJWT, fetchAdminController);

// FETCH ONE ADMIN
adminRouter.get('/fetchOne/:adminId', authenticateAdminJWT, fetchOneAdminController);

// FETCH ALL ADMIN
adminRouter.get('/fetchAll', authenticateAdminJWT, fetchAllAdminController);

// DELETE ADMIN
adminRouter.delete('/delete/:adminId', authenticateAdminJWT, deleteAdminController);

// EDIT ADMIN
adminRouter.put('/edit/:adminId', authenticateAdminJWT, editAdminController);

// FETCH ADMIN TOTALS
adminRouter.get('/totals', authenticateAdminJWT, fetchAdminTotalController);



export default adminRouter;