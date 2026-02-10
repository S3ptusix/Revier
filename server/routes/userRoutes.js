import express from 'express';
import { fetchUserController, logoutUserController, userLoginController, userRegistrationController } from '../controllers/userControllers.js';
import { authenticateUserJWT } from '../middleware/auth.js';

const userRouter = express.Router();

// REGISTER USER 
userRouter.post('/register', userRegistrationController);

// LOGIN USER 
userRouter.post('/login', userLoginController);

// FETCH USER
userRouter.get('/fetch', authenticateUserJWT, fetchUserController);

// LOGOUT USER
userRouter.get('/logout', authenticateUserJWT, logoutUserController);

export default userRouter;