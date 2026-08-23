import express from 'express';
import {
    fetchHomeContentController,
    fetchHomeSectionController,
    updateContactSectionController,
    updateHeroSectionController,
    updateHowItWorksSectionController,
    updateHowItWorksStepsController,
    uploadSectionImageController
} from '../controllers/systemContentHomeControllers.js';
import { authenticateAdminJWT, authorizeRoles } from '../middleware/auth.js';
import imageUpload from '../middleware/imageUpload.js';
import { systemContentImageUploadLimiter, systemContentPublicLimiter, systemContentWriteLimiter } from '../middleware/rateLimiter/systemContentHomeRateLimiter.js';
// NOTE: swap authenticateUserJWT below for an admin-only middleware
// (e.g. authenticateAdminJWT) if the project has a separate one —
// homepage content edits shouldn't be gated behind plain user auth
// in production.

const systemContentHomeRouter = express.Router();

// FETCH ALL HOME CONTENT
systemContentHomeRouter.get('/fetch', systemContentPublicLimiter, fetchHomeContentController);

// FETCH HOME SECTION
systemContentHomeRouter.get('/fetch/:section', systemContentPublicLimiter, fetchHomeSectionController);

// UPDATE HERO SECTION
systemContentHomeRouter.put('/hero/update', systemContentWriteLimiter, authenticateAdminJWT, authorizeRoles('HR Manager'), updateHeroSectionController);

// UPDATE HOW IT WORKS SECTION
systemContentHomeRouter.put('/howItWorks/update', systemContentWriteLimiter, authenticateAdminJWT, authorizeRoles('HR Manager'), updateHowItWorksSectionController);

// UPDATE HOW IT WORKS STEPS
systemContentHomeRouter.put('/howItWorks/steps/update', systemContentWriteLimiter, authenticateAdminJWT, authorizeRoles('HR Manager'), updateHowItWorksStepsController);

// UPDATE CONTACT SECTION
systemContentHomeRouter.put('/contact/update', systemContentWriteLimiter, authenticateAdminJWT, authorizeRoles('HR Manager'), updateContactSectionController);

// UPLOAD/REPLACE SECTION IMAGE
systemContentHomeRouter.post(
    '/image/:field/upload',
    systemContentImageUploadLimiter,
    authenticateAdminJWT,
    authorizeRoles('HR Manager'),
    imageUpload.single('image'),
    uploadSectionImageController
);

export default systemContentHomeRouter;
