import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE}/api/reports`,
});

const unwrap = (response) => response.data.data;

/**
 * Sentinel companyId value meaning "aggregate across every company".
 * Must match the backend's ALL_COMPANIES constant.
 */
export const ALL_COMPANIES = 'all';

const withParams = (companyId, startDate, endDate) => ({
    params: { companyId, startDate, endDate },
    withCredentials: true,
});

export const getExecutiveSummary = (companyId, startDate, endDate) =>
    api.get('/summary', withParams(companyId, startDate, endDate)).then(unwrap);

export const getTimeToHire = (companyId, startDate, endDate) =>
    api.get('/time-to-hire', withParams(companyId, startDate, endDate)).then(unwrap);

export const getPipeline = (companyId, startDate, endDate) =>
    api.get('/pipeline', withParams(companyId, startDate, endDate)).then(unwrap);

export const getRejectionAnalysis = (companyId, startDate, endDate) =>
    api.get('/rejections', withParams(companyId, startDate, endDate)).then(unwrap);

export const getCandidateQuality = (companyId, startDate, endDate) =>
    api.get('/quality', withParams(companyId, startDate, endDate)).then(unwrap);

export const getHiringTrend = (companyId, startDate, endDate) =>
    api.get('/trend', withParams(companyId, startDate, endDate)).then(unwrap);

/**
 * Single source of truth for the 7 report sections: id, display label,
 * and the fetcher to call for it. Both the selection checklist and the
 * data-fetch step in ClientReport.jsx are driven off this list, so
 * adding a new report only means adding one entry here.
 */
export const REPORT_DEFINITIONS = [
    { id: 'summary', label: 'Executive Summary', fetch: getExecutiveSummary },
    { id: 'timeToHire', label: 'Time to Hire', fetch: getTimeToHire },
    { id: 'pipeline', label: 'Candidate Pipeline', fetch: getPipeline },
    { id: 'rejections', label: 'Rejection Analysis', fetch: getRejectionAnalysis },
    { id: 'quality', label: 'Candidate Quality', fetch: getCandidateQuality },
    { id: 'trend', label: 'Hiring Trend', fetch: getHiringTrend },
];

/**
 * Fetches only the selected report sections, in parallel.
 * Returns a map of { [reportId]: data }. If one report fails, the
 * others still resolve — the failed one is stored as { error } so the
 * page can show a per-section error instead of failing the whole batch.
 */
export const getSelectedReports = async (selectedIds, companyId, startDate, endDate) => {
    const targets = REPORT_DEFINITIONS.filter((r) => selectedIds.includes(r.id));

    const results = await Promise.all(
        targets.map(async (report) => {
            try {
                const data = await report.fetch(companyId, startDate, endDate);
                return [report.id, data];
            } catch (err) {
                return [report.id, { error: err.response?.data?.message || err.message }];
            }
        })
    );

    return Object.fromEntries(results);
};