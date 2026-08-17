import { Router } from 'express';
import * as reportsControllers from '../controllers/reportsControllers.js';
import { authenticateAdminJWT } from '../middleware/auth.js';

const router = Router();

router.get('/summary', authenticateAdminJWT, reportsControllers.getSummary);
router.get('/time-to-hire', authenticateAdminJWT, reportsControllers.getTimeToHire);
router.get('/pipeline', authenticateAdminJWT, reportsControllers.getPipeline);
router.get('/rejections', authenticateAdminJWT, reportsControllers.getRejections);
router.get('/quality', authenticateAdminJWT, reportsControllers.getQuality);
router.get('/trend', authenticateAdminJWT, reportsControllers.getTrend);

export default router;