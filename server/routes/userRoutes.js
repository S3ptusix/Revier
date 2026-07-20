import express from 'express';
import { applyStatusController, applyUserController, changePasswordController, editApplicationController, fetchAllNotificationController, fetchAllSavedJobListController, fetchAllSavedJobsController, fetchUserController, fetchUserProfileController, logoutUserController, recentApplicantionController, saveJobController, userLoginController, userRegistrationController, userUpdateController } from '../controllers/userControllers.js';
import { authenticateUserJWT } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
// import { upload } from '../middleware/uploads.js';

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
userRouter.put(
    '/profile/update',
    authenticateUserJWT,
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'validId', maxCount: 1 }
    ]),
    userUpdateController
);

// READ PROFILE
userRouter.get('/profile/fetch', authenticateUserJWT, fetchUserProfileController);

// APPLY
userRouter.post(
    '/apply/:jobId',
    authenticateUserJWT,
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'validId', maxCount: 1 }
    ]),
    applyUserController
);

// EDIT APPLICATION
userRouter.put(
    '/edit/:applicationId',
    authenticateUserJWT,
    upload.fields([
        { name: 'resume', maxCount: 1 },
        { name: 'validId', maxCount: 1 }
    ]),
    editApplicationController
);

// RECENT APPLICATIONS
userRouter.get('/recentApplications', authenticateUserJWT, recentApplicantionController);

// FETCH ALL NOTIFICATION
userRouter.get('/notification', authenticateUserJWT, fetchAllNotificationController);

// SAVE JOB
userRouter.put('/saveJob/:jobId', authenticateUserJWT, saveJobController);

// FETCH ALL SAVED JOB LIST
userRouter.get('/savedJobs/list', authenticateUserJWT, fetchAllSavedJobListController);

// FETCH ALL SAVED JOB
userRouter.get('/savedJobs', authenticateUserJWT, fetchAllSavedJobsController);

// IS APPLIED TO THE JOB
userRouter.get('/applyStatus/:jobId', authenticateUserJWT, applyStatusController);

// CHANGE PASSWORD
userRouter.put('/changePassword', authenticateUserJWT, changePasswordController);

export default userRouter;