import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { REPORT_DEFINITIONS } from '../services/reportsServices.js';
import { INSIGHT_GENERATORS } from '../utils/insights.js';

const EMERALD = '#10B981';
const EMERALD_DARK = '#047857';

/**
 * Fixed pixel dimensions for print charts, sized to fit inside a
 * Letter/A4 page with 1.5cm margins (~700px usable width at 96dpi).
 *
 * Deliberately NOT using Recharts' <ResponsiveContainer> here: it
 * measures its container via ResizeObserver at render time and bakes
 * that pixel width into the SVG. If this component is hidden on
 * screen (display: none) until print, ResizeObserver never fires and
 * the chart can render at 0 width; if it's visible but off-screen at
 * the dashboard's on-screen width, the SVG is sized for the wrong
 * page. A fixed width/height sidesteps both failure modes — the
 * chart is correctly sized the moment it mounts, regardless of
 * whether its container is visible, off-screen, or being printed.
 */
const PRINT_CHART_WIDTH = 680;
const PRINT_CHART_HEIGHT = 260;

const toChartData = (report, key = 'value') =>
    (report?.labels || []).map((label, i) => ({ name: label, [key]: report.data?.[i] ?? 0 }));

const NoData = ({ message = 'No data for the selected date range' }) => (
    <p className="text-sm italic text-gray-400">{message}</p>
);

const InsightLine = ({ text }) =>
    text ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <span className="font-medium">Insight: </span>
            {text}
        </p>
    ) : null;

const PrintSection = ({ title, children, insight }) => (
    <section className="print-report-section">
        <h2 className="mb-3 text-base font-semibold text-gray-900">{title}</h2>
        {children}
        <InsightLine text={insight} />
    </section>
);

/**
 * Renders one report section for print, using fixed-size charts.
 * Mirrors ClientReport.jsx's renderSection, but is intentionally kept
 * independent (no shared render function) so this component has zero
 * runtime dependency on the interactive dashboard's DOM/CSS state.
 */
const renderPrintSection = (id, report) => {
    const label = REPORT_DEFINITIONS.find((r) => r.id === id)?.label ?? id;
    const insight = report && !report.error ? INSIGHT_GENERATORS[id]?.(report) : null;

    if (!report || report.error || !report.labels?.length) {
        return (
            <PrintSection key={id} title={label}>
                <NoData message={report?.error || 'No data for the selected date range'} />
            </PrintSection>
        );
    }

    switch (id) {
        case 'summary': {
            const kpis = report.kpis;
            return (
                <PrintSection key={id} title={label} insight={insight}>
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            {[
                                ['Total Jobs', kpis.totalJobs],
                                ['Applicants', kpis.totalApplicants],
                                ['Hired', kpis.totalHired],
                                ['Rejected', kpis.totalRejected],
                                ['Fill Rate', `${kpis.fillRate}%`],
                                ['Avg. Time to Hire', `${kpis.avgTimeToHire} days`],
                            ].map(([lbl, val]) => (
                                <tr key={lbl} className="border-b border-gray-200">
                                    <td className="py-1.5 pr-4 text-gray-600">{lbl}</td>
                                    <td className="py-1.5 font-semibold text-gray-900">{val}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </PrintSection>
            );
        }

        case 'trend': {
            const data = toChartData(report, 'hires');
            return (
                <PrintSection key={id} title={label} insight={insight}>
                    <LineChart width={PRINT_CHART_WIDTH} height={PRINT_CHART_HEIGHT} data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#374151' }} />
                        <YAxis tick={{ fontSize: 11, fill: '#374151' }} allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hires" stroke={EMERALD_DARK} strokeWidth={2.5} dot={{ r: 3 }} isAnimationActive={false} />
                    </LineChart>
                </PrintSection>
            );
        }

        case 'rejections': {
            const data = toChartData(report, 'count');
            return (
                <PrintSection key={id} title={label} insight={insight}>
                    <BarChart width={PRINT_CHART_WIDTH} height={PRINT_CHART_HEIGHT} data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" tick={{ fontSize: 11, fill: '#374151' }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: '#374151' }} />
                        <Tooltip />
                        <Bar dataKey="count" fill={EMERALD} isAnimationActive={false} />
                    </BarChart>
                </PrintSection>
            );
        }

        case 'timeToHire':
        case 'pipeline':
        case 'quality':
        default: {
            const valueKey = id === 'timeToHire' ? 'days' : 'count';
            const data = toChartData(report, valueKey);
            return (
                <PrintSection key={id} title={label} insight={insight}>
                    <BarChart width={PRINT_CHART_WIDTH} height={PRINT_CHART_HEIGHT} data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 10, fill: '#374151' }}
                            interval={0}
                            angle={data.length > 5 ? -20 : 0}
                            textAnchor={data.length > 5 ? 'end' : 'middle'}
                            height={data.length > 5 ? 50 : 25}
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#374151' }} allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey={valueKey} fill={EMERALD} isAnimationActive={false} />
                    </BarChart>
                </PrintSection>
            );
        }
    }
};

/**
 * Self-contained print rendering of the client report. Always mounted
 * (kept off-screen via the .print-only CSS class, not display:none —
 * see clientPrint.css) so its fixed-size Recharts elements render
 * correctly the moment data arrives, independent of the interactive
 * dashboard's scroll container, sidebar, or on-screen width.
 *
 * @param {string} companyName
 * @param {string} startDate
 * @param {string} endDate
 * @param {string[]} selectedReportIds - report ids to include, in order
 * @param {object} reportsById - { [reportId]: reportData }
 */
export default function PrintableClientReport({ companyName, startDate, endDate, selectedReportIds, reportsById }) {
    if (!selectedReportIds || selectedReportIds.length === 0) return null;

    return (
        <div className="print-only">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Hiring Performance Report{companyName ? ` — ${companyName}` : ''}
                </h1>
                <p className="text-sm text-gray-500">
                    Report from {startDate} to {endDate}
                </p>
            </div>

            <div className="space-y-6">
                {selectedReportIds.map((id) => renderPrintSection(id, reportsById[id]))}
            </div>
        </div>
    );
}