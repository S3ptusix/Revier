/* eslint-disable no-unused-vars */
import Sidemenu from "../components/Sidemenu";
import Loading from "../components/Loading";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
    fetchRecruitmentOverview,
    fetchHiringTrend,
    fetchAttritionTrend,
    fetchHiringVelocity,
    fetchJobPerformance,
    fetchCompanyPerformance,
    fetchDashboardTotals
} from "../services/reportsAnalyticsService";
import { fetchAllSelectCompany } from "../services/companyServices";
import {
    ResponsiveContainer,
    ComposedChart,
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    TextRun,
    HeadingLevel,
    WidthType,
    AlignmentType,
    ShadingType,
    BorderStyle
} from "docx";
import PptxGenJS from "pptxgenjs";
import { EmptyState, Panel, StatCard } from "../components/Reports";
import { BriefcaseBusiness, CalendarCheck, CalendarClock, ClipboardCheck, Clock3, TrendingUp, UserRoundCheck, UserRoundX, Users } from "lucide-react";
import Select from "../components/ui/Select";

// npm install docx pptxgenjs   (both are needed for the export buttons below)

const EMERALD = "#10b981";
const EMERALD_LIGHT = "#a7f3d0";
const GRAY = "#d1d5db";
const EMERALD_HEX = "10B981";
const GRAY_HEX = "D1D5DB";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function Reports() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [year, setYear] = useState(currentYear);
    const [companyId, setCompanyId] = useState("");
    const [companies, setCompanies] = useState([]);

    const [overview, setOverview] = useState(null);
    const [dashboardTotals, setDashboardTotals] = useState(null);
    const [hiringTrend, setHiringTrend] = useState([]);
    const [attritionTrend, setAttritionTrend] = useState([]);
    const [hiringVelocity, setHiringVelocity] = useState([]);
    const [jobPerformance, setJobPerformance] = useState([]);
    const [companyPerformance, setCompanyPerformance] = useState([]);

    // company list for the filter dropdown. The endpoint paginates
    // (10/page by default) so we ask for a larger page size to get
    // the full list in one call — adjust the param name if your
    // backend uses something other than "limit".
    useEffect(() => {
        fetchAllSelectCompany()
            .then(res => setCompanies(res?.success ? res.companies ?? [] : []))
            .catch(() => setCompanies([]));
    }, []);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const params = {
            year,
            ...(companyId ? { companyId } : {})
        };

        // these services never throw — they resolve to either
        // { success: true, data } or { success: false, message }
        const [
            overviewRes,
            totalsRes,
            trendRes,
            attritionRes,
            velocityRes,
            jobRes,
            companyRes
        ] = await Promise.all([
            fetchRecruitmentOverview(params),
            fetchDashboardTotals(params),
            fetchHiringTrend(params),
            fetchAttritionTrend(params),
            fetchHiringVelocity(params),
            fetchJobPerformance(params),
            // company performance is a breakdown across companies —
            // only meaningful when no single company is selected
            companyId
                ? Promise.resolve({ success: true, data: [] })
                : fetchCompanyPerformance(params)
        ]);

        const responses = [
            overviewRes,
            totalsRes,
            trendRes,
            attritionRes,
            velocityRes,
            jobRes,
            companyRes
        ];
        const firstFailure = responses.find(r => r?.success === false);

        setOverview(overviewRes?.data ?? null);
        setDashboardTotals(totalsRes?.data ?? null);
        setHiringTrend(trendRes?.data ?? []);
        setAttritionTrend(attritionRes?.data ?? []);
        setHiringVelocity(velocityRes?.data ?? []);
        setJobPerformance(jobRes?.data ?? []);
        setCompanyPerformance(companyRes?.data ?? []);

        setError(firstFailure ? firstFailure.message : null);
        setIsLoading(false);
    }, [year, companyId]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // merge trend + attrition for a combined view where useful
    const trendChartData = useMemo(() => {
        return hiringTrend.map((m, i) => ({
            month: m.month,
            applicants: m.applicants,
            hired: m.hired,
            hiringRate: m.hiringRate
        }));
    }, [hiringTrend]);

    const attritionChartData = useMemo(() => {
        return attritionTrend.map(m => ({
            month: m.month,
            processed: m.processed,
            rejected: m.rejected,
            attritionRate: m.attritionRate
        }));
    }, [attritionTrend]);

    const velocityChartData = useMemo(() => {
        return hiringVelocity.map(m => ({
            month: m.month,
            days: m.hiringVelocity
        }));
    }, [hiringVelocity]);

    const totals = dashboardTotals?.totals;
    const operations = dashboardTotals?.operations;
    const performance = dashboardTotals?.performance;

    const [isExporting, setIsExporting] = useState(false);

    const selectedCompanyName = useMemo(() => {
        if (!companyId) return "All Companies";
        return (
            companies.find(c => String(c.id) === String(companyId))
                ?.companyName ?? "Selected Company"
        );
    }, [companies, companyId]);

    const reportFilenameBase = `recruitment-report-${year}${companyId ? `-company-${companyId}` : ""
        }`;

    // shared table data, reused by both the Word and PowerPoint builders
    const reportTables = useMemo(() => {
        const summary = {
            header: ["Metric", "Value"],
            rows: [
                ["Total applicants", String(totals?.totalApplicants ?? 0)],
                ["Active pipeline", String(operations?.activePipeline ?? 0)],
                ["Hired", String(totals?.hired ?? 0)],
                ["Rejected", String(totals?.rejected ?? 0)],
                ["Hiring rate", `${performance?.hiringRate ?? 0}%`],
                ["Attrition rate", `${performance?.attritionRate ?? 0}%`],
                ["Avg. days to hire", String(performance?.avgHiringDays ?? 0)],
                ["Scheduled interviews", String(operations?.scheduledInterviews ?? 0)],
                ["Scheduled orientations", String(operations?.scheduledOrientations ?? 0)],
                ["Upcoming orientations", String(operations?.incomingOrientations ?? 0)]
            ]
        };

        const trend = {
            header: ["Month", "Applicants", "Hired", "Hiring Rate"],
            rows: hiringTrend.map(m => [
                m.month,
                String(m.applicants),
                String(m.hired),
                `${m.hiringRate}%`
            ])
        };

        const attrition = {
            header: ["Month", "Processed", "Rejected", "Attrition Rate"],
            rows: attritionTrend.map(m => [
                m.month,
                String(m.processed),
                String(m.rejected),
                `${m.attritionRate}%`
            ])
        };

        const velocity = {
            header: ["Month", "Avg. Days to Hire"],
            rows: hiringVelocity.map(m => [m.month, String(m.hiringVelocity)])
        };

        const jobs = {
            header: ["Job Title", "Applicants", "Hired", "Success Rate"],
            rows: jobPerformance.map(r => [
                r.job ?? "—",
                String(r.applicants),
                String(r.hired),
                `${r.successRate}%`
            ])
        };

        const companyRows = {
            header: [
                "Company",
                "Applicants",
                "Hired",
                "Success Rate",
                "Avg. Days to Hire"
            ],
            rows: companyPerformance.map(r => [
                r.companyName,
                String(r.applicants),
                String(r.hired),
                `${r.successRate}%`,
                String(r.averageDaysToHire)
            ])
        };

        return { summary, trend, attrition, velocity, jobs, companyRows };
    }, [
        totals,
        operations,
        performance,
        hiringTrend,
        attritionTrend,
        hiringVelocity,
        jobPerformance,
        companyPerformance
    ]);

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    const handleExportWord = async () => {
        setIsExporting(true);
        try {
            const makeTable = ({ header, rows }) => {
                const headerRow = new TableRow({
                    tableHeader: true,
                    children: header.map(
                        h =>
                            new TableCell({
                                shading: { type: ShadingType.CLEAR, fill: EMERALD_HEX },
                                children: [
                                    new Paragraph({
                                        children: [
                                            new TextRun({ text: h, bold: true, color: "FFFFFF" })
                                        ]
                                    })
                                ]
                            })
                    )
                });

                const bodyRows = rows.length
                    ? rows.map(
                        r =>
                            new TableRow({
                                children: r.map(
                                    cell =>
                                        new TableCell({
                                            children: [new Paragraph(cell)]
                                        })
                                )
                            })
                    )
                    : [
                        new TableRow({
                            children: header.map(
                                (_, i) =>
                                    new TableCell({
                                        children: [
                                            new Paragraph(i === 0 ? "No data" : "")
                                        ]
                                    })
                            )
                        })
                    ];

                return new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 2, color: GRAY_HEX },
                        bottom: { style: BorderStyle.SINGLE, size: 2, color: GRAY_HEX },
                        left: { style: BorderStyle.SINGLE, size: 2, color: GRAY_HEX },
                        right: { style: BorderStyle.SINGLE, size: 2, color: GRAY_HEX },
                        insideHorizontal: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: GRAY_HEX
                        },
                        insideVertical: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: GRAY_HEX
                        }
                    },
                    rows: [headerRow, ...bodyRows]
                });
            };

            const sectionHeading = text =>
                new Paragraph({
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 300, after: 150 },
                    children: [new TextRun({ text, bold: true })]
                });

            const children = [
                new Paragraph({
                    heading: HeadingLevel.TITLE,
                    children: [new TextRun({ text: "Recruitment Report", bold: true })]
                }),
                new Paragraph({
                    spacing: { after: 300 },
                    children: [
                        new TextRun({
                            text: `${selectedCompanyName} · ${year}`,
                            color: "6B7280"
                        })
                    ]
                }),
                sectionHeading("Summary"),
                makeTable(reportTables.summary),
                sectionHeading("Hiring Trend"),
                makeTable(reportTables.trend),
                sectionHeading("Attrition Trend"),
                makeTable(reportTables.attrition),
                sectionHeading("Hiring Velocity"),
                makeTable(reportTables.velocity),
                sectionHeading("Job Position Performance"),
                makeTable(reportTables.jobs)
            ];

            if (!companyId) {
                children.push(
                    sectionHeading("Company Hiring Performance"),
                    makeTable(reportTables.companyRows)
                );
            }

            const doc = new Document({
                sections: [{ properties: {}, children }]
            });

            const blob = await Packer.toBlob(doc);
            downloadBlob(blob, `${reportFilenameBase}.docx`);
        } catch (err) {
            console.error(err);
            setError("Couldn't generate the Word report. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPpt = async () => {
        setIsExporting(true);
        try {
            const pptx = new PptxGenJS();
            pptx.defineLayout({ name: "REPORT", width: 10, height: 5.63 });
            pptx.layout = "REPORT";

            const addTitleSlide = () => {
                const slide = pptx.addSlide();
                slide.background = { color: "FFFFFF" };
                slide.addText("Recruitment Report", {
                    x: 0.5,
                    y: 1.8,
                    w: 9,
                    h: 1,
                    fontSize: 32,
                    bold: true,
                    color: "111827"
                });
                slide.addText(`${selectedCompanyName}  ·  ${year}`, {
                    x: 0.5,
                    y: 2.6,
                    w: 9,
                    h: 0.6,
                    fontSize: 16,
                    color: "6B7280"
                });
                slide.addShape(pptx.ShapeType.rect, {
                    x: 0.5,
                    y: 1.6,
                    w: 1.2,
                    h: 0.05,
                    fill: { color: EMERALD_HEX }
                });
            };

            const addTableSlide = (title, { header, rows }) => {
                const slide = pptx.addSlide();
                slide.background = { color: "FFFFFF" };
                slide.addText(title, {
                    x: 0.4,
                    y: 0.3,
                    w: 9.2,
                    h: 0.5,
                    fontSize: 20,
                    bold: true,
                    color: "111827"
                });

                const displayRows = rows.length
                    ? rows
                    : [header.map((_, i) => (i === 0 ? "No data" : ""))];

                const tableRows = [
                    header.map(h => ({
                        text: h,
                        options: {
                            bold: true,
                            color: "FFFFFF",
                            fill: { color: EMERALD_HEX },
                            fontSize: 11
                        }
                    })),
                    ...displayRows.map(r =>
                        r.map(cell => ({
                            text: cell,
                            options: { color: "374151", fontSize: 10 }
                        }))
                    )
                ];

                slide.addTable(tableRows, {
                    x: 0.4,
                    y: 1.0,
                    w: 9.2,
                    border: { type: "solid", color: GRAY_HEX, pt: 0.75 },
                    autoPage: true,
                    autoPageRepeatHeader: true
                });
            };

            addTitleSlide();
            addTableSlide("Summary", reportTables.summary);
            addTableSlide("Hiring Trend", reportTables.trend);
            addTableSlide("Attrition Trend", reportTables.attrition);
            addTableSlide("Hiring Velocity", reportTables.velocity);
            addTableSlide("Job Position Performance", reportTables.jobs);
            if (!companyId) {
                addTableSlide("Company Hiring Performance", reportTables.companyRows);
            }

            await pptx.writeFile({ fileName: `${reportFilenameBase}.pptx` });
        } catch (err) {
            console.error(err);
            setError("Couldn't generate the PowerPoint report. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    const companyOptions = [
        {
            value: "",
            name: "All companies",
        },
        ...companies.map((c) => ({
            value: c.id,
            name: c.companyName,
        })),
    ];

    const yearOptions = YEAR_OPTIONS.map((y) => ({
        value: y,
        name: y,
    }));

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto bg-white">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="bg-gray-50 p-8 flex flex-col gap-8">
                        {/* report header */}
                        <section className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-2xl font-semibold">Reports</p>
                                <p className="text-gray-500">
                                    Comprehensive reports and data summaries
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex gap-3">
                                    <div className="w-fit">
                                        <Select
                                            options={companyOptions}
                                            value={companyId}
                                            onChange={(e) => setCompanyId(e.target.value)}
                                        />
                                    </div>

                                    <div className="w-32">
                                        <Select
                                            options={yearOptions}
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="w-px h-6 bg-gray-300 mx-1" />

                                <button
                                    type="button"
                                    onClick={handleExportWord}
                                    disabled={isExporting}
                                    className="btn bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? "Generating…" : "Export Word"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleExportPpt}
                                    disabled={isExporting}
                                    className="btn rounded-lg bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? "Generating…" : "Export PPTX"}
                                </button>
                            </div>
                        </section>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* KPI cards */}
                        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            <StatCard
                                label="Total applicants"
                                value={totals?.totalApplicants ?? overview?.totalApplicants ?? 0}
                                icon={Users}
                            />

                            <StatCard
                                label="Active pipeline"
                                value={operations?.activePipeline ?? overview?.activeApplicants ?? 0}
                                icon={BriefcaseBusiness}
                            />

                            <StatCard
                                label="Hired"
                                value={totals?.hired ?? overview?.hiredApplicants ?? 0}
                                accent
                                icon={UserRoundCheck}
                            />

                            <StatCard
                                label="Rejected"
                                value={totals?.rejected ?? overview?.rejectedApplicants ?? 0}
                                icon={UserRoundX}
                            />

                            <StatCard
                                label="Hiring rate"
                                value={performance?.hiringRate ?? overview?.hiringRate ?? 0}
                                suffix="%"
                                accent
                                icon={TrendingUp}
                            />

                            <StatCard
                                label="Avg. days to hire"
                                value={performance?.avgHiringDays ?? 0}
                                icon={Clock3}
                            />
                        </section>

                        {/* pipeline operations */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard
                                label="Scheduled interviews"
                                value={operations?.scheduledInterviews ?? 0}
                                icon={CalendarCheck}
                            />

                            <StatCard
                                label="Scheduled orientations"
                                value={operations?.scheduledOrientations ?? 0}
                                icon={ClipboardCheck}
                            />

                            <StatCard
                                label="Upcoming orientations"
                                value={operations?.incomingOrientations ?? 0}
                                icon={CalendarClock}
                            />
                        </section>

                        {/* hiring trend + attrition trend */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Panel
                                title="Hiring trend"
                                subtitle={`Applicants vs. hires by month, ${year}`}
                            >
                                {trendChartData.length ? (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <ComposedChart data={trendChartData}>
                                            <CartesianGrid stroke={GRAY} strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: GRAY }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderColor: GRAY, borderRadius: 8, fontSize: 12 }} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                            <Bar yAxisId="left" dataKey="applicants" fill={EMERALD_LIGHT} name="Applicants" radius={[4, 4, 0, 0]} />
                                            <Bar yAxisId="left" dataKey="hired" fill={EMERALD} name="Hired" radius={[4, 4, 0, 0]} />
                                            <Line yAxisId="right" type="monotone" dataKey="hiringRate" stroke="#047857" strokeWidth={2} dot={false} name="Hiring rate" />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState />
                                )}
                            </Panel>

                            <Panel
                                title="Attrition trend"
                                subtitle={`Rejected vs. processed by month, ${year}`}
                            >
                                {attritionChartData.length ? (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <ComposedChart data={attritionChartData}>
                                            <CartesianGrid stroke={GRAY} strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: GRAY }} />
                                            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                                            <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderColor: GRAY, borderRadius: 8, fontSize: 12 }} />
                                            <Legend wrapperStyle={{ fontSize: 12 }} />
                                            <Bar yAxisId="left" dataKey="processed" fill="#e5e7eb" name="Processed" radius={[4, 4, 0, 0]} />
                                            <Bar yAxisId="left" dataKey="rejected" fill="#f87171" name="Rejected" radius={[4, 4, 0, 0]} />
                                            <Line yAxisId="right" type="monotone" dataKey="attritionRate" stroke="#b91c1c" strokeWidth={2} dot={false} name="Attrition rate" />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState />
                                )}
                            </Panel>
                        </section>

                        {/* hiring velocity */}
                        <section>
                            <Panel
                                title="Hiring velocity"
                                subtitle="Average days from application to hire, by month"
                            >
                                {velocityChartData.some(m => m.days > 0) ? (
                                    <ResponsiveContainer width="100%" height={260}>
                                        <BarChart data={velocityChartData}>
                                            <CartesianGrid stroke={GRAY} strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: GRAY }} />
                                            <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} tickLine={false} axisLine={false} unit="d" />
                                            <Tooltip contentStyle={{ borderColor: GRAY, borderRadius: 8, fontSize: 12 }} formatter={v => [`${v} days`, "Avg. time to hire"]} />
                                            <Bar dataKey="days" fill={EMERALD} radius={[4, 4, 0, 0]} name="Days to hire" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <EmptyState />
                                )}
                            </Panel>
                        </section>

                        {/* job performance */}
                        <section>
                            <Panel
                                title="Job position performance"
                                subtitle={companyId ? `${year}` : `Top 5 positions, ${year}`}
                            >
                                {jobPerformance.length ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-gray-500 border-b border-gray-300">
                                                    <th className="py-2 pr-4 font-medium">Job title</th>
                                                    <th className="py-2 pr-4 font-medium">Applicants</th>
                                                    <th className="py-2 pr-4 font-medium">Hired</th>
                                                    <th className="py-2 pr-4 font-medium">Success rate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobPerformance.map((row, i) => (
                                                    <tr key={i} className="border-b border-gray-100 last:border-0">
                                                        <td className="py-3 pr-4 text-gray-900">{row.job}</td>
                                                        <td className="py-3 pr-4 text-gray-600">{row.applicants}</td>
                                                        <td className="py-3 pr-4 text-gray-600">{row.hired}</td>
                                                        <td className="py-3 pr-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="h-1.5 w-24 rounded-full bg-gray-200 overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-emerald-500"
                                                                        style={{ width: `${Math.min(row.successRate, 100)}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-gray-600">{row.successRate}%</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <EmptyState />
                                )}
                            </Panel>
                        </section>

                        {/* company performance — only relevant across all companies */}
                        {!companyId && (
                            <section>
                                <Panel
                                    title="Company hiring performance"
                                    subtitle={`${year}`}
                                >
                                    {companyPerformance.length ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-gray-500 border-b border-gray-300">
                                                        <th className="py-2 pr-4 font-medium">Company</th>
                                                        <th className="py-2 pr-4 font-medium">Applicants</th>
                                                        <th className="py-2 pr-4 font-medium">Hired</th>
                                                        <th className="py-2 pr-4 font-medium">Success rate</th>
                                                        <th className="py-2 pr-4 font-medium">Avg. days to hire</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {companyPerformance.map((row, i) => (
                                                        <tr key={i} className="border-b border-gray-100 last:border-0">
                                                            <td className="py-3 pr-4 text-gray-900">{row.companyName}</td>
                                                            <td className="py-3 pr-4 text-gray-600">{row.applicants}</td>
                                                            <td className="py-3 pr-4 text-gray-600">{row.hired}</td>
                                                            <td className="py-3 pr-4 text-gray-600">{row.successRate}%</td>
                                                            <td className="py-3 pr-4 text-gray-600">{row.averageDaysToHire}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <EmptyState />
                                    )}
                                </Panel>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}