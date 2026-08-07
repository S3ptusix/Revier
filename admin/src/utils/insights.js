/**
 * Small, deterministic "insight" generators — one per report type.
 * These read the same {labels, data, ...} shape the API returns and
 * produce a single sentence, so the client-facing report reads less
 * like a raw chart and more like a briefing.
 *
 * Every function is defensive: empty/partial data returns null so the
 * caller can skip rendering the insight line entirely.
 */

export const summaryInsight = (report) => {
    const kpis = report?.kpis;
    if (!kpis || kpis.totalApplicants === 0) return null;

    return `${kpis.totalHired} of ${kpis.totalApplicants} applicants were hired (${kpis.fillRate}% of open slots filled), averaging ${kpis.avgTimeToHire} day${kpis.avgTimeToHire === 1 ? '' : 's'} to hire.`;
};

export const timeToHireInsight = (report) => {
    if (!report?.labels?.length) return null;

    const fastestIdx = report.data.indexOf(Math.min(...report.data));
    const slowestIdx = report.data.indexOf(Math.max(...report.data));

    return `Fastest fill: "${report.labels[fastestIdx]}" at ${report.data[fastestIdx]} days. Slowest: "${report.labels[slowestIdx]}" at ${report.data[slowestIdx]} days. Overall average: ${report.overallAvgDays} days.`;
};

export const pipelineInsight = (report) => {
    if (!report?.data?.length) return null;

    const total = report.data.reduce((a, b) => a + b, 0);
    if (total === 0) return null;

    // Biggest drop-off between consecutive stages
    let maxDrop = -Infinity;
    let dropStage = null;
    for (let i = 0; i < report.data.length - 1; i += 1) {
        const drop = report.data[i] - report.data[i + 1];
        if (drop > maxDrop) {
            maxDrop = drop;
            dropStage = `${report.labels[i]} → ${report.labels[i + 1]}`;
        }
    }

    return dropStage
        ? `${total} candidates entered the pipeline. The largest drop-off is between ${dropStage}.`
        : `${total} candidates entered the pipeline in this period.`;
};

export const rejectionInsight = (report) => {
    if (!report?.labels?.length) return null;

    const topIdx = report.data.indexOf(Math.max(...report.data));
    return `The leading rejection reason is "${report.labels[topIdx]}", accounting for ${report.percentages[topIdx]}% of rejections.`;
};

export const qualityInsight = (report) => {
    if (!report || report.totalInterviewed === 0) return null;

    return `${report.passRate}% of the ${report.totalInterviewed} candidates interviewed passed.`;
};

export const trendInsight = (report) => {
    if (!report?.data?.length || report.data.length < 2) return null;

    const first = report.data[0];
    const last = report.data[report.data.length - 1];
    if (first === 0) return null;

    const change = parseFloat((((last - first) / first) * 100).toFixed(1));
    const direction = change >= 0 ? 'up' : 'down';
    return `Hires are ${direction} ${Math.abs(change)}% from ${report.labels[0]} to ${report.labels[report.labels.length - 1]}.`;
};

export const INSIGHT_GENERATORS = {
    summary: summaryInsight,
    timeToHire: timeToHireInsight,
    pipeline: pipelineInsight,
    rejections: rejectionInsight,
    quality: qualityInsight,
    trend: trendInsight,
};