import { sequelize } from '../config/sequelize.js';
import { Admins } from '../models/index.js'; // adjust path to match your project

/**
 * Sentinel value the frontend sends to mean "aggregate across every
 * company" rather than filter to one.
 */
export const ALL_COMPANIES = 'all';

/**
 * ------------------------------------------------------------------
 * Shared validation helpers
 * ------------------------------------------------------------------
 */

/**
 * Resolves the incoming companyId query param to either a numeric id
 * or `null` (meaning "no company filter — aggregate across all
 * companies"). Throws if the value is missing or not "all"/a number.
 */
const resolveCompanyId = (companyId) => {
    if (companyId === undefined || companyId === null || companyId === '') {
        throw new Error('companyId is required (use "all" to aggregate across every company)');
    }
    if (companyId === ALL_COMPANIES) return null;

    const id = parseInt(companyId, 10);
    if (Number.isNaN(id)) {
        throw new Error('companyId must be "all" or a valid number');
    }
    return id;
};

/**
 * Validates and normalizes a startDate/endDate pair. endDate is
 * treated as inclusive (bumped to 23:59:59.999). startDate must be
 * strictly earlier than endDate.
 */
const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) {
        throw new Error('startDate and endDate are required');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        throw new Error('startDate and endDate must be valid dates (YYYY-MM-DD)');
    }

    if (start >= end) {
        throw new Error('startDate must be earlier than endDate');
    }

    end.setHours(23, 59, 59, 999);
    return { start, end };
};

/**
 * Resolves the requested companyId against the admin's access:
 * - HR Manager (or any unrestricted role) → no change, id passes through as-is.
 * - HR Associate + specific companyId requested → must be in holdCompanies,
 *   otherwise throws (this is a genuine access violation, not an empty result).
 * - HR Associate + "all" requested (id === null) → resolves to their
 *   holdCompanies list, so "all" means "all companies I can see."
 *
 * Returns { id, allowedIds } where:
 *   - id: the single companyId to filter to, or null to aggregate
 *   - allowedIds: array of companyIds to restrict to when id is null and
 *     the admin is restricted; null when unrestricted
 */
const resolveCompanyScope = async (id, role, adminId) => {
    if (role !== 'HR Associate') {
        return { id, allowedIds: null };
    }

    const admin = await Admins.findByPk(adminId, { attributes: ['holdCompanies'] });
    if (!admin) {
        throw new Error('Admin not found.');
    }

    const holdCompanies = admin.holdCompanies || [];

    if (id !== null) {
        // specific company requested — must be one they're allowed to see
        if (!holdCompanies.includes(id)) {
            throw new Error('You do not have access to this company.');
        }
        return { id, allowedIds: null };
    }

    // "all" requested — restrict aggregation to their assigned companies
    return { id: null, allowedIds: holdCompanies };
};

/**
 * Builds a SQL fragment that filters by a single company, a restricted
 * set of companies, or nothing (aggregate across everything).
 */
const companyFilter = (alias, companyIdValue, allowedIds) => {
    if (companyIdValue !== null) {
        return `AND ${alias}.companyId = :companyId`;
    }
    if (allowedIds !== null) {
        // empty array would produce invalid `IN ()` — caller must short-circuit before this
        return `AND ${alias}.companyId IN (:allowedIds)`;
    }
    return '';
};

/**
 * ------------------------------------------------------------------
 * 1. EXECUTIVE SUMMARY
 * ------------------------------------------------------------------
 */
export const getExecutiveSummary = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);

    if (allowedIds !== null && allowedIds.length === 0) {
        return {
            labels: ['Applicants', 'Hired', 'Rejected', 'Fill Rate (%)', 'Avg. Time to Hire (days)'],
            data: [0, 0, 0, 0, 0],
            kpis: { totalJobs: 0, totalApplicants: 0, totalHired: 0, totalRejected: 0, fillRate: 0, avgTimeToHire: 0 },
        };
    }

    const [row] = await sequelize.query(
        `
        SELECT
            jobStats.totalJobs AS totalJobs,
            jobStats.totalSlots AS totalSlots,
            COUNT(a.id) AS totalApplicants,
            SUM(CASE WHEN a.applicantStatus = 'Hired' THEN 1 ELSE 0 END) AS totalHired,
            SUM(CASE WHEN a.isRejected = 1 THEN 1 ELSE 0 END) AS totalRejected,
            AVG(
                CASE WHEN a.applicantStatus = 'Hired' AND a.hiredAt IS NOT NULL
                     THEN DATEDIFF(a.hiredAt, a.createdAt)
                END
            ) AS avgTimeToHireDays
        FROM (
            SELECT COUNT(*) AS totalJobs, COALESCE(SUM(slot), 0) AS totalSlots
            FROM jobs
            WHERE deletedAt IS NULL ${companyFilter('jobs', id, allowedIds)}
        ) jobStats
        LEFT JOIN jobs j
            ON j.deletedAt IS NULL ${companyFilter('j', id, allowedIds)}
        LEFT JOIN applicants a
            ON a.jobId = j.id AND a.deletedAt IS NULL AND a.createdAt BETWEEN :start AND :end
        GROUP BY jobStats.totalJobs, jobStats.totalSlots
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    const totalHired = parseInt(row?.totalHired, 10) || 0;
    const totalSlots = parseInt(row?.totalSlots, 10) || 0;
    const fillRate = totalSlots > 0 ? parseFloat(((totalHired / totalSlots) * 100).toFixed(2)) : 0;
    const avgTimeToHire =
        row?.avgTimeToHireDays !== null && row?.avgTimeToHireDays !== undefined
            ? parseFloat(parseFloat(row.avgTimeToHireDays).toFixed(1))
            : 0;

    const kpis = {
        totalJobs: parseInt(row?.totalJobs, 10) || 0,
        totalApplicants: parseInt(row?.totalApplicants, 10) || 0,
        totalHired,
        totalRejected: parseInt(row?.totalRejected, 10) || 0,
        fillRate,
        avgTimeToHire,
    };

    return {
        labels: ['Applicants', 'Hired', 'Rejected', 'Fill Rate (%)', 'Avg. Time to Hire (days)'],
        data: [kpis.totalApplicants, kpis.totalHired, kpis.totalRejected, kpis.fillRate, kpis.avgTimeToHire],
        kpis,
    };
};

/**
 * ------------------------------------------------------------------
 * 2. TIME TO HIRE
 * ------------------------------------------------------------------
 */
export const getTimeToHire = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);

    if (allowedIds !== null && allowedIds.length === 0) {
        return { labels: [], data: [], overallAvgDays: 0 };
    }

    const rows = await sequelize.query(
        `
        SELECT
            j.id AS jobId,
            j.jobTitle AS jobTitle,
            c.companyName AS companyName,
            AVG(DATEDIFF(a.hiredAt, a.createdAt)) AS avgDays,
            COUNT(a.id) AS hiredCount
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        JOIN companies c ON c.id = j.companyId AND c.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.applicantStatus = 'Hired'
            AND a.hiredAt BETWEEN :start AND :end
            ${companyFilter('j', id, allowedIds)}
        GROUP BY j.id, j.jobTitle, c.companyName
        ORDER BY avgDays DESC
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    const totalHires = rows.reduce((sum, r) => sum + parseInt(r.hiredCount, 10), 0);
    const overallAvg =
        totalHires > 0
            ? parseFloat(
                (rows.reduce((sum, r) => sum + parseFloat(r.avgDays) * parseInt(r.hiredCount, 10), 0) / totalHires).toFixed(1)
            )
            : 0;

    const label = (r) => (id === null ? `${r.companyName} — ${r.jobTitle}` : r.jobTitle);

    return {
        labels: rows.map(label),
        data: rows.map((r) => parseFloat(parseFloat(r.avgDays).toFixed(1))),
        overallAvgDays: overallAvg,
    };
};

/**
 * ------------------------------------------------------------------
 * 3. CANDIDATE PIPELINE
 * ------------------------------------------------------------------
 */
export const getPipeline = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);
    const stages = ['New', 'Interview', 'Orientation', 'Hired'];

    if (allowedIds !== null && allowedIds.length === 0) {
        return { labels: stages, data: stages.map(() => 0) };
    }

    const rows = await sequelize.query(
        `
        SELECT a.applicantStatus AS status, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.createdAt BETWEEN :start AND :end
            ${companyFilter('j', id, allowedIds)}
        GROUP BY a.applicantStatus
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    const countMap = rows.reduce((acc, r) => {
        acc[r.status] = parseInt(r.count, 10);
        return acc;
    }, {});

    return {
        labels: stages,
        data: stages.map((s) => countMap[s] || 0),
    };
};

/**
 * ------------------------------------------------------------------
 * 4. REJECTION ANALYSIS
 * ------------------------------------------------------------------
 */
export const getRejectionAnalysis = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);

    if (allowedIds !== null && allowedIds.length === 0) {
        return { labels: [], data: [], percentages: [], total: 0 };
    }

    const rows = await sequelize.query(
        `
        SELECT a.rejectedReason AS reason, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.isRejected = 1
            AND a.rejectedAt BETWEEN :start AND :end
            ${companyFilter('j', id, allowedIds)}
        GROUP BY a.rejectedReason
        ORDER BY count DESC
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    const total = rows.reduce((sum, r) => sum + parseInt(r.count, 10), 0);

    return {
        labels: rows.map((r) => r.reason || 'Unspecified'),
        data: rows.map((r) => parseInt(r.count, 10)),
        percentages: rows.map((r) =>
            total > 0 ? parseFloat(((parseInt(r.count, 10) / total) * 100).toFixed(2)) : 0
        ),
        total,
    };
};

/**
 * ------------------------------------------------------------------
 * 5. CANDIDATE QUALITY
 * ------------------------------------------------------------------
 */
export const getCandidateQuality = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);

    if (allowedIds !== null && allowedIds.length === 0) {
        return { labels: ['Passed', 'Failed'], data: [0, 0], passRate: 0, totalInterviewed: 0 };
    }

    const rows = await sequelize.query(
        `
        SELECT a.interviewStatus AS status, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.interviewStatus IS NOT NULL
            AND a.interviewAt BETWEEN :start AND :end
            ${companyFilter('j', id, allowedIds)}
        GROUP BY a.interviewStatus
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    const countMap = rows.reduce((acc, r) => {
        acc[r.status] = parseInt(r.count, 10);
        return acc;
    }, {});

    const passed = countMap['Passed'] || 0;
    const failed = countMap['Failed'] || 0;
    const totalInterviewed = passed + failed;
    const passRate = totalInterviewed > 0 ? parseFloat(((passed / totalInterviewed) * 100).toFixed(2)) : 0;

    return {
        labels: ['Passed', 'Failed'],
        data: [passed, failed],
        passRate,
        totalInterviewed,
    };
};

/**
 * ------------------------------------------------------------------
 * 6. HIRING TREND
 * ------------------------------------------------------------------
 */
export const getHiringTrend = async (companyId, startDate, endDate, role, adminId) => {
    const requestedId = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const { id, allowedIds } = await resolveCompanyScope(requestedId, role, adminId);

    if (allowedIds !== null && allowedIds.length === 0) {
        return { labels: [], data: [] };
    }

    const rows = await sequelize.query(
        `
        SELECT DATE_FORMAT(a.hiredAt, '%Y-%m') AS period, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.applicantStatus = 'Hired'
            AND a.hiredAt BETWEEN :start AND :end
            ${companyFilter('j', id, allowedIds)}
        GROUP BY period
        ORDER BY period ASC
        `,
        { replacements: { companyId: id, allowedIds, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    return {
        labels: rows.map((r) => r.period),
        data: rows.map((r) => parseInt(r.count, 10)),
    };
};