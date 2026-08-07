import { Router } from 'express';
import * as reportsControllers from '../controllers/reportsControllers.js';

const router = Router();

router.get('/summary', reportsControllers.getSummary);
router.get('/time-to-hire', reportsControllers.getTimeToHire);
router.get('/pipeline', reportsControllers.getPipeline);
router.get('/rejections', reportsControllers.getRejections);
router.get('/quality', reportsControllers.getQuality);
router.get('/trend', reportsControllers.getTrend);

export default router;