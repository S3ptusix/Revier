import express from 'express';
import { fetchUserController, fetchUserProfileController, logoutUserController, userLoginController, userRegistrationController, userUpdateController } from '../controllers/userControllers.js';
import { authenticateUserJWT } from '../middleware/auth.js';
import { upload } from '../middleware/uploads.js';

const userRouter = express.Router();

// REGISTER USER 
userRouter.post('/register', userRegistrationController);

// LOGIN USER 
userRouter.post('/login', userLoginController);

// FETCH USER
userRouter.get('/fetch', authenticateUserJWT, fetchUserController);

// LOGOUT USER
userRouter.get('/logout', authenticateUserJWT, logoutUserController);

// UPDATE USER PROFILE
userRouter.put('/profile/update', authenticateUserJWT, userUpdateController);

// READ PROFILE
userRouter.get('/profile/fetch', authenticateUserJWT, fetchUserProfileController);

export default userRouter;