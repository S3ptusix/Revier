import { sequelize } from '../config/sequelize.js';

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
 * Builds a SQL fragment that filters by company when one is selected,
 * or an empty string when aggregating across all companies.
 */
const companyFilter = (alias, companyIdValue) =>
    companyIdValue !== null ? `AND ${alias}.companyId = :companyId` : '';

/**
 * ------------------------------------------------------------------
 * 1. EXECUTIVE SUMMARY
 * Top-line KPIs: jobs, applicants, hires, rejections, fill rate,
 * average time to hire — for one company, or aggregated across all.
 * ------------------------------------------------------------------
 */
export const getExecutiveSummary = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);

    // Job/slot totals are computed in a pre-aggregated subquery first,
    // then joined once, to avoid double-counting slots when the
    // subsequent applicant join fans a job out into multiple rows.
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
            WHERE deletedAt IS NULL ${companyFilter('jobs', id)}
        ) jobStats
        LEFT JOIN jobs j
            ON j.deletedAt IS NULL ${companyFilter('j', id)}
        LEFT JOIN applicants a
            ON a.jobId = j.id AND a.deletedAt IS NULL AND a.createdAt BETWEEN :start AND :end
        GROUP BY jobStats.totalJobs, jobStats.totalSlots
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
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
 * Average days from application (createdAt) to hire (hiredAt), per
 * job, for hires whose hiredAt falls in the date range. When
 * aggregating across all companies, each job is labeled with its
 * company so identically-named job titles at different companies
 * don't get merged together.
 * ------------------------------------------------------------------
 */
export const getTimeToHire = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);

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
            ${companyFilter('j', id)}
        GROUP BY j.id, j.jobTitle, c.companyName
        ORDER BY avgDays DESC
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
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
 * Applicants per pipeline stage, for one company or aggregated
 * across all companies, filtered by application createdAt.
 * ------------------------------------------------------------------
 */
export const getPipeline = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);
    const stages = ['New', 'Interview', 'Orientation', 'Hired'];

    const rows = await sequelize.query(
        `
        SELECT a.applicantStatus AS status, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.createdAt BETWEEN :start AND :end
            ${companyFilter('j', id)}
        GROUP BY a.applicantStatus
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
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
 * Rejected applicants grouped by reason (filtered by rejectedAt),
 * for one company or aggregated across all companies.
 * ------------------------------------------------------------------
 */
export const getRejectionAnalysis = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);

    const rows = await sequelize.query(
        `
        SELECT a.rejectedReason AS reason, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.isRejected = 1
            AND a.rejectedAt BETWEEN :start AND :end
            ${companyFilter('j', id)}
        GROUP BY a.rejectedReason
        ORDER BY count DESC
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
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
 * Interview pass/fail rate (filtered by interviewAt), for one
 * company or aggregated across all companies.
 * ------------------------------------------------------------------
 */
export const getCandidateQuality = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);

    const rows = await sequelize.query(
        `
        SELECT a.interviewStatus AS status, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.interviewStatus IS NOT NULL
            AND a.interviewAt BETWEEN :start AND :end
            ${companyFilter('j', id)}
        GROUP BY a.interviewStatus
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
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
 * Hires per month within the date range (filtered by hiredAt), for
 * one company or aggregated across all companies.
 * ------------------------------------------------------------------
 */
export const getHiringTrend = async (companyId, startDate, endDate) => {
    const id = resolveCompanyId(companyId);
    const { start, end } = validateDateRange(startDate, endDate);

    const rows = await sequelize.query(
        `
        SELECT DATE_FORMAT(a.hiredAt, '%Y-%m') AS period, COUNT(a.id) AS count
        FROM applicants a
        JOIN jobs j ON j.id = a.jobId AND j.deletedAt IS NULL
        WHERE a.deletedAt IS NULL
            AND a.applicantStatus = 'Hired'
            AND a.hiredAt BETWEEN :start AND :end
            ${companyFilter('j', id)}
        GROUP BY period
        ORDER BY period ASC
        `,
        { replacements: { companyId: id, start, end }, type: sequelize.QueryTypes.SELECT }
    );

    return {
        labels: rows.map((r) => r.period),
        data: rows.map((r) => parseInt(r.count, 10)),
    };
};