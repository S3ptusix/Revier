import express from 'express';
import { adminRegistrationController, changePasswordController, deleteAdminController, editAdminController, editProfileController, fetchAdminController, fetchAdminTotalController, fetchAllAdminController, fetchAllAdminLogController, fetchOneAdminController, loginAdminController, logoutAdminController } from '../controllers/adminControllers.js';
import { authenticateAdminJWT, authorizeRoles } from '../middleware/auth.js';
import { adminChangePasswordLimiter, adminGeneralLimiter, adminLoginAccountLimiter, adminLoginLimiter, adminRegisterLimiter } from '../middleware/rateLimiter/adminRateLimiter.js';

const adminRouter = express.Router();

// REGISTER ADMIN 
adminRouter.post('/register', adminRegisterLimiter, authenticateAdminJWT, authorizeRoles('HR Manager'), adminRegistrationController);

// LOGIN ADMIN 
adminRouter.post('/login', adminLoginLimiter, adminLoginAccountLimiter, loginAdminController);

// LOGOUT ADMIN
adminRouter.get('/logout', adminGeneralLimiter, authenticateAdminJWT, logoutAdminController);

// FETCH ADMIN
adminRouter.get('/fetch', adminGeneralLimiter, authenticateAdminJWT, fetchAdminController);

// FETCH ONE ADMIN
adminRouter.get('/fetchOne/:adminId', adminGeneralLimiter, authenticateAdminJWT, fetchOneAdminController);

// FETCH ALL ADMIN
adminRouter.get('/fetchAll', adminGeneralLimiter, authenticateAdminJWT, fetchAllAdminController);

// DELETE ADMIN
adminRouter.delete('/delete/:adminId', adminGeneralLimiter, authenticateAdminJWT, deleteAdminController);

// EDIT ADMIN
adminRouter.put('/edit/:adminId', adminGeneralLimiter, authenticateAdminJWT, editAdminController);

// FETCH ADMIN TOTALS
adminRouter.get('/totals', adminGeneralLimiter, authenticateAdminJWT, fetchAdminTotalController);

// EDIT PROFILE
adminRouter.put('/profile/edit', adminGeneralLimiter, authenticateAdminJWT, editProfileController);

// CHANGE PASSWORD
adminRouter.put('/profile/changePassword', adminChangePasswordLimiter, authenticateAdminJWT, changePasswordController);

// FETCH ALL ADMIN LOG
adminRouter.get('/log/fetchAll', adminGeneralLimiter, authenticateAdminJWT, fetchAllAdminLogController);

export default adminRouter;
