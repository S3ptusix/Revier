import * as reportService from '../services/reportsServices.js';

/**
 * Wraps a service call, forwarding companyId/startDate/endDate from the
 * query string. Validation errors from the service (missing/invalid
 * companyId or date range) are surfaced as 400s; anything else is a 500.
 */
const handle = (serviceFn) => async (req, res) => {
    const { companyId, startDate, endDate } = req.query;

    try {
        const data = await serviceFn(companyId, startDate, endDate);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        const isValidationError = /required|valid date|valid number|earlier than/i.test(error.message || '');
        console.error('[clientReportController]', error);
        return res.status(isValidationError ? 400 : 500).json({
            success: false,
            message: error.message || 'Failed to generate report',
        });
    }
};

// GET /api/client-reports/summary?companyId=&startDate=&endDate=
export const getSummary = handle(reportService.getExecutiveSummary);

// GET /api/client-reports/time-to-hire?companyId=&startDate=&endDate=
export const getTimeToHire = handle(reportService.getTimeToHire);

// GET /api/client-reports/pipeline?companyId=&startDate=&endDate=
export const getPipeline = handle(reportService.getPipeline);

// GET /api/client-reports/rejections?companyId=&startDate=&endDate=
export const getRejections = handle(reportService.getRejectionAnalysis);

// GET /api/client-reports/quality?companyId=&startDate=&endDate=
export const getQuality = handle(reportService.getCandidateQuality);

// GET /api/client-reports/trend?companyId=&startDate=&endDate=
export const getTrend = handle(reportService.getHiringTrend);