import express from 'express';
import { adminRegistrationController, fetchAdminController, loginAdminController, logoutAdminController } from '../controllers/adminControllers.js';
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



export default adminRouter;