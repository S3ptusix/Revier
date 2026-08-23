import { Router } from 'express';
import * as reportsControllers from '../controllers/reportsControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';
import { reportsGeneralLimiter } from '../middleware/rateLimiter/reportsRateLimiter.js';

const router = Router();

router.get('/summary', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getSummary);
router.get('/time-to-hire', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getTimeToHire);
router.get('/pipeline', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getPipeline);
router.get('/rejections', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getRejections);
router.get('/quality', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getQuality);
router.get('/trend', reportsGeneralLimiter, authenticateAdminJWT, reportsControllers.getTrend);

export default router;
