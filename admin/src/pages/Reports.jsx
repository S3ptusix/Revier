/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Printer, FileText, Presentation, RefreshCw, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { REPORT_DEFINITIONS, getSelectedReports, ALL_COMPANIES } from '../services/reportsServices.js';
import { INSIGHT_GENERATORS } from '../utils/insights.js';
import { exportClientReportToWord, exportClientReportToPowerPoint } from '../utils/exportUtils.js';
import { fetchAllSelectCompany } from '../services/companyServices.js';
import Sidemenu from '../components/Sidemenu.jsx';
import Loading from '../components/Loading.jsx';
import PrintableClientReport from '../components/PrintableClientReport.jsx';

const EMERALD = '#10B981';
const EMERALD_DARK = '#047857';

const ALL_REPORT_IDS = REPORT_DEFINITIONS.map((r) => r.id);

/** Formats a Date as a local YYYY-MM-DD string (avoids UTC-shift bugs from toISOString). */
const toLocalISODate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/** Default range: first day of the current month through today. */
const getDefaultDateRange = () => {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: toLocalISODate(firstOfMonth), endDate: toLocalISODate(now) };
};

// ---------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------

const NoData = ({ message = 'No data for the selected date range' }) => (
    <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
        {message}
    </div>
);

const InsightLine = ({ text }) =>
    text ? (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <span className="font-medium">Insight: </span>
            {text}
        </p>
    ) : null;

const ReportSection = ({ title, children, insight }) => (
    <section className="print-section bg-white border border-gray-300 rounded-xl p-5">
        <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
        {children}
        <InsightLine text={insight} />
    </section>
);

// ---------------------------------------------------------------
// Data transform: {labels, data} -> recharts array
// ---------------------------------------------------------------

const toChartData = (report, key = 'value') =>
    (report?.labels || []).map((label, i) => ({ name: label, [key]: report.data?.[i] ?? 0 }));

// ---------------------------------------------------------------
// Main page
// ---------------------------------------------------------------

export default function Reports() {
    // Draft filters (bound to inputs) vs. applied filters (used for fetching).
    // Company defaults to "All Companies"; dates default to this-month-to-date.
    const [draftFilters, setDraftFilters] = useState(() => ({
        companyId: ALL_COMPANIES,
        ...getDefaultDateRange(),
    }));
    const [appliedFilters, setAppliedFilters] = useState(null);

    const [companies, setCompanies] = useState([]);
    const [companiesError, setCompaniesError] = useState(false);

    const [selectedReports, setSelectedReports] = useState(ALL_REPORT_IDS);
    const [reportsById, setReportsById] = useState({});
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCompanies = async () => {
            try {

                const { success, companies } = await fetchAllSelectCompany();
                if (success) setCompanies(companies);
            } catch (error) {
                console.error(error);
                setCompaniesError(true);
            }
        };

        loadCompanies();
    }, []);

    // Date range validation: startDate must be strictly earlier than endDate.
    const dateError = useMemo(() => {
        if (!draftFilters.startDate || !draftFilters.endDate) return null;
        if (draftFilters.startDate > draftFilters.endDate) {
            return 'Start date must be earlier than end date.';
        }
        return null;
    }, [draftFilters.startDate, draftFilters.endDate]);

    const canApply =
        !!draftFilters.companyId &&
        !!draftFilters.startDate &&
        !!draftFilters.endDate &&
        !dateError &&
        selectedReports.length > 0;

    const handleApply = async () => {
        if (!canApply) return;
        setError(null);
        setLoading(true);
        setAppliedFilters(draftFilters);
        try {
            const data = await getSelectedReports(
                selectedReports,
                draftFilters.companyId,
                draftFilters.startDate,
                draftFilters.endDate
            );
            setReportsById(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load one or more reports. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleReport = (id) => {
        setSelectedReports((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
    };

    const selectAll = () => setSelectedReports(ALL_REPORT_IDS);
    const clearAll = () => setSelectedReports([]);

    const selectedCompanyName = useMemo(() => {
        if (!appliedFilters) return '';
        if (appliedFilters.companyId === ALL_COMPANIES) return 'All Companies';
        const match = companies.find((c) => String(c.id) === String(appliedFilters.companyId));
        return match?.companyName || '';
    }, [companies, appliedFilters]);

    const exportMeta = appliedFilters
        ? { companyName: selectedCompanyName, startDate: appliedFilters.startDate, endDate: appliedFilters.endDate }
        : null;

    const handlePrint = () => window.print();

    const handleExportWord = () => {
        if (!appliedFilters) return;
        exportClientReportToWord(reportsById, selectedReports, exportMeta);
    };

    const handleExportPptx = async () => {
        if (!appliedFilters) return;
        setExporting(true);
        try {
            await exportClientReportToPowerPoint(reportsById, selectedReports, exportMeta);
        } finally {
            setExporting(false);
        }
    };

    const hasResults = appliedFilters && Object.keys(reportsById).length > 0;

    // -------------------------------------------------------------
    // Section renderers, keyed by report id
    // -------------------------------------------------------------

    const renderSection = (id) => {
        const report = reportsById[id];
        const label = REPORT_DEFINITIONS.find((r) => r.id === id)?.label;
        const insight = report && !report.error ? INSIGHT_GENERATORS[id]?.(report) : null;

        if (!report || report.error || !report.labels?.length) {
            return (
                <ReportSection key={id} title={label}>
                    <NoData message={report?.error || 'No data for the selected date range'} />
                </ReportSection>
            );
        }

        switch (id) {
            case 'summary': {
                const kpis = report.kpis;
                return (
                    <ReportSection key={id} title={label} insight={insight}>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {[
                                ['Total Jobs', kpis.totalJobs],
                                ['Applicants', kpis.totalApplicants],
                                ['Hired', kpis.totalHired],
                                ['Rejected', kpis.totalRejected],
                                ['Fill Rate', `${kpis.fillRate}%`],
                                ['Avg. Time to Hire', `${kpis.avgTimeToHire}d`],
                            ].map(([lbl, val]) => (
                                <div key={lbl} className="rounded-lg border border-gray-200 p-3">
                                    <p className="text-xs text-gray-500">{lbl}</p>
                                    <p className="text-xl font-semibold text-gray-900">{val}</p>
                                </div>
                            ))}
                        </div>
                    </ReportSection>
                );
            }

            case 'trend': {
                const data = toChartData(report, 'hires');
                return (
                    <ReportSection key={id} title={label} insight={insight}>
                        <ResponsiveContainer width="100%" height={260}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#374151' }} />
                                <YAxis tick={{ fontSize: 12, fill: '#374151' }} allowDecimals={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="hires" stroke={EMERALD_DARK} strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ReportSection>
                );
            }

            case 'rejections': {
                const data = toChartData(report, 'count');
                return (
                    <ReportSection key={id} title={label} insight={insight}>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis type="number" tick={{ fontSize: 12, fill: '#374151' }} allowDecimals={false} />
                                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12, fill: '#374151' }} />
                                <Tooltip />
                                <Bar dataKey="count" fill={EMERALD} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ReportSection>
                );
            }

            case 'timeToHire':
            case 'pipeline':
            case 'quality':
            default: {
                const valueKey = id === 'timeToHire' ? 'days' : 'count';
                const data = toChartData(report, valueKey);
                return (
                    <ReportSection key={id} title={label} insight={insight}>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#374151' }}
                                    interval={0}
                                    angle={data.length > 5 ? -20 : 0}
                                    textAnchor={data.length > 5 ? 'end' : 'middle'}
                                    height={data.length > 5 ? 60 : 30}
                                />
                                <YAxis tick={{ fontSize: 12, fill: '#374151' }} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey={valueKey} fill={EMERALD} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ReportSection>
                );
            }
        }
    };

    useEffect(() => {
        handleApply();
    }, []);

    return (
        // print-root: reset to a plain block on print so the sidebar's flex
        // sibling doesn't constrain how much of the report can flow onto the page.
        <div className="print-root flex h-screen max-w-screen">
            {/* Sidebar must never appear in the printed output. */}
            <div className="no-print">
                <Sidemenu />
            </div>

            <div className="print-scroll-container bg-gray-50 grow max-h-screen flex flex-col overflow-auto">

                <div className='print-area p-8'>

                    {/* Header */}
                    <div className="no-print mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Client Report</h1>
                        <p className="text-sm text-gray-500">
                            Hiring performance you can present directly to the client company
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="no-print mb-6 rounded-xl border border-gray-300 p-5">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Company</label>
                                <select
                                    value={draftFilters.companyId}
                                    onChange={(e) => setDraftFilters((f) => ({ ...f, companyId: e.target.value }))}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                >
                                    <option value={ALL_COMPANIES}>All Companies</option>
                                    {companies.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.companyName}
                                        </option>
                                    ))}
                                </select>
                                {companiesError && (
                                    <input
                                        type="number"
                                        placeholder="Or enter a Company ID"
                                        value={draftFilters.companyId === ALL_COMPANIES ? '' : draftFilters.companyId}
                                        onChange={(e) =>
                                            setDraftFilters((f) => ({
                                                ...f,
                                                companyId: e.target.value === '' ? ALL_COMPANIES : e.target.value,
                                            }))
                                        }
                                        className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Start Date</label>
                                <input
                                    type="date"
                                    value={draftFilters.startDate}
                                    onChange={(e) => setDraftFilters((f) => ({ ...f, startDate: e.target.value }))}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${dateError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">End Date</label>
                                <input
                                    type="date"
                                    value={draftFilters.endDate}
                                    onChange={(e) => setDraftFilters((f) => ({ ...f, endDate: e.target.value }))}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${dateError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-emerald-500'
                                        }`}
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleApply}
                                    disabled={!canApply || loading}
                                    className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                                >
                                    {loading ? 'Loading…' : 'Apply Filter'}
                                </button>
                            </div>
                        </div>

                        {dateError && (
                            <p className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
                                <AlertCircle size={14} /> {dateError}
                            </p>
                        )}
                    </div>

                    {/* Report selection panel */}
                    <div className="no-print mb-6 rounded-xl border border-gray-300 p-5">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">Report Sections</h2>
                            <div className="flex gap-2 text-xs">
                                <button onClick={selectAll} className="text-emerald-600 hover:underline">
                                    Select All
                                </button>
                                <span className="text-gray-300">|</span>
                                <button onClick={clearAll} className="text-emerald-600 hover:underline">
                                    Clear All
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {REPORT_DEFINITIONS.map((r) => {
                                const checked = selectedReports.includes(r.id);
                                return (
                                    <button
                                        key={r.id}
                                        onClick={() => toggleReport(r.id)}
                                        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {checked ? (
                                            <CheckSquare size={16} className="text-emerald-500 shrink-0" />
                                        ) : (
                                            <Square size={16} className="text-gray-400 shrink-0" />
                                        )}
                                        {r.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="no-print mb-6 flex flex-wrap gap-2">
                        <button
                            onClick={handlePrint}
                            disabled={!hasResults}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Printer size={16} /> Print Selected
                        </button>
                        <button
                            onClick={handleExportWord}
                            disabled={!hasResults}
                            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <FileText size={16} /> Export Word
                        </button>
                        <button
                            onClick={handleExportPptx}
                            disabled={!hasResults || exporting}
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                        >
                            <Presentation size={16} />
                            {exporting ? 'Exporting…' : 'Export PowerPoint'}
                        </button>
                    </div>

                    {error && (
                        <div className="no-print mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Results — on-screen only. The dedicated PrintableClientReport
                        component below is the single source of truth for print
                        output, so this whole block is excluded from print rather
                        than relying on CSS to reflow it correctly. */}
                    <div className="no-print">
                        {loading ? (
                            <Loading />
                        ) : !appliedFilters ? (
                            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
                                Select a company, date range, and at least one report, then Apply Filter.
                            </div>
                        ) : selectedReports.length === 0 ? (
                            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-400">
                                No report sections selected.
                            </div>
                        ) : (
                            <div className="space-y-6">{selectedReports.map((id) => renderSection(id))}</div>
                        )}
                    </div>

                    {/* Print output — hidden on screen, shown only for print (see
                        .print-only in clientPrint.css). Fixed-size charts inside
                        make this reliable regardless of the dashboard's on-screen
                        layout, scroll state, or viewport width. */}
                    {hasResults && (
                        <PrintableClientReport
                            companyName={selectedCompanyName}
                            startDate={appliedFilters.startDate}
                            endDate={appliedFilters.endDate}
                            selectedReportIds={selectedReports}
                            reportsById={reportsById}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}