import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList
} from "recharts";
import SideMenu from "../components/SideMenu";
import Loading from "../components/Loading";
import { useEffect, useCallback, useState } from "react";
import { getDashboardData } from "../services/dashboardServices";
import {
    ArrowUp,
    ArrowDown,
    AlertTriangle,
    RefreshCw,
    Users,
    UserCheck,
    UserX,
    Briefcase,
    Clock,
    Video,
    MapPin,
    CalendarX,
    ChevronRight
} from "lucide-react";
import { socket } from "../socket";

const SUMMARY_META = {
    Applicants: { icon: Users, tone: "emerald" },
    Hired: { icon: UserCheck, tone: "blue" },
    Rejected: { icon: UserX, tone: "rose" },
    "Open Jobs": { icon: Briefcase, tone: "amber" }
};

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async ({ silent } = {}) => {
        if (silent) setIsRefreshing(true);
        try {
            const res = await getDashboardData();
            setData(res);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("We couldn't load your dashboard data.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        const onSocketUpdate = () => fetchData({ silent: true });
        socket.on("dashboard", onSocketUpdate);
        fetchData();

        return () => {
            socket.off("dashboard", onSocketUpdate);
        };
    }, [fetchData]);

    return (
        <div className="flex h-screen bg-white">
            <SideMenu />

            <div className="bg-gray-50 flex-1 overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState message={error} onRetry={() => fetchData()} />
                ) : !data ? (
                    <ErrorState message="No dashboard data available." onRetry={() => fetchData()} />
                ) : (
                    <div className="p-8 space-y-8 animate-in fade-in duration-300">

                        {/* HEADER */}
                        <section className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    Dashboard
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Recruitment overview and activity
                                </p>
                            </div>
                            <div
                                className={`flex items-center gap-1.5 text-xs text-gray-400 mt-1.5 transition-opacity ${isRefreshing ? "opacity-100" : "opacity-0"}`}
                                aria-live="polite"
                            >
                                <RefreshCw size={12} className="animate-spin" />
                                Syncing
                            </div>
                        </section>

                        {/* ========================= */}
                        {/* SUMMARY */}
                        {/* ========================= */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {Object.entries(SUMMARY_META).map(([title, meta]) => (
                                <SummaryCard
                                    key={title}
                                    title={title}
                                    data={data.summary[summaryKey(title)]}
                                    icon={meta.icon}
                                    tone={meta.tone}
                                />
                            ))}
                        </section>

                        {/* ========================= */}
                        {/* FUNNEL CHART */}
                        {/* ========================= */}
                        <section className="bg-white border border-gray-200 rounded-xl p-6 transition-shadow hover:shadow-sm">

                            <h2 className="font-semibold text-gray-800 mb-1">
                                Hiring Funnel
                            </h2>

                            <p className="text-xs text-gray-400 mb-4">Candidates by stage, most recent cycle</p>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { stage: "New", count: data.pipeline.New },
                                            { stage: "Interview", count: data.pipeline.Interview },
                                            { stage: "Orientation", count: data.pipeline.Orientation },
                                            { stage: "Hired", count: data.pipeline.Hired }
                                        ]}
                                        margin={{ top: 24, right: 8, left: 8, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                                        <XAxis
                                            dataKey="stage"
                                            tickLine={false}
                                            axisLine={{ stroke: "#e5e7eb" }}
                                            tick={{ fill: "#6b7280", fontSize: 12 }}
                                        />

                                        <Tooltip
                                            cursor={{ fill: "#f0fdf4" }}
                                            contentStyle={{
                                                borderRadius: "8px",
                                                border: "1px solid #d1d5db",
                                                fontSize: "13px"
                                            }}
                                        />

                                        <Bar
                                            dataKey="count"
                                            radius={[8, 8, 0, 0]}
                                            fill="#10b981"
                                            maxBarSize={72}
                                        >
                                            <LabelList
                                                dataKey="count"
                                                position="top"
                                                style={{ fill: "#374151", fontSize: 12, fontWeight: 600 }}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* ========================= */}
                        {/* SCHEDULES */}
                        {/* ========================= */}
                        <section className="grid lg:grid-cols-2 gap-6">

                            {/* INTERVIEWS */}
                            <ScheduleCard
                                title="Today's Interviews"
                                count={data.schedules.interviewsToday.length}
                            >
                                {data.schedules.interviewsToday.length === 0 ? (
                                    <Empty text="No interviews today" icon={CalendarX} />
                                ) : (
                                    <div className="space-y-2.5">
                                        {data.schedules.interviewsToday
                                            .slice()
                                            .sort((a, b) => new Date(a.interviewAt) - new Date(b.interviewAt))
                                            .map(item => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 border border-gray-200 rounded-lg p-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors"
                                                >
                                                    <Avatar firstName={item.firstName} lastName={item.lastName} />

                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-800 truncate">
                                                            {item.firstName} {item.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <Clock size={12} />
                                                            {new Date(item.interviewAt).toLocaleString(undefined, {
                                                                hour: "numeric",
                                                                minute: "2-digit"
                                                            })}
                                                        </p>
                                                    </div>

                                                    <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 whitespace-nowrap shrink-0">
                                                        {item.interviewMode?.toLowerCase() === "online" ? (
                                                            <Video size={12} />
                                                        ) : (
                                                            <MapPin size={12} />
                                                        )}
                                                        {item.interviewMode}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </ScheduleCard>

                            {/* ORIENTATIONS */}
                            <ScheduleCard
                                title="Upcoming Orientations"
                                count={data.schedules.upcomingOrientations.length}
                            >
                                {data.schedules.upcomingOrientations.length === 0 ? (
                                    <Empty text="No upcoming orientations" icon={CalendarX} />
                                ) : (
                                    <div className="space-y-2.5">
                                        {data.schedules.upcomingOrientations
                                            .slice()
                                            .sort((a, b) => new Date(a.eventAt) - new Date(b.eventAt))
                                            .map(event => {
                                                const eventDate = new Date(event.eventAt);
                                                const isToday = eventDate.toDateString() === new Date().toDateString();

                                                return (
                                                    <div
                                                        key={event.id}
                                                        className="border border-gray-200 rounded-lg p-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <p className="font-semibold text-gray-800">
                                                                {event.eventTitle}
                                                            </p>
                                                            {isToday && (
                                                                <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                                                    Today
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="space-y-1">
                                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {eventDate.toLocaleString(undefined, {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "numeric",
                                                                    minute: "2-digit"
                                                                })}
                                                            </p>

                                                            {event.location && (
                                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                                    <MapPin size={12} />
                                                                    {event.location}
                                                                </p>
                                                            )}

                                                            <p className="text-xs">Attendees: {event?.attendeesCount || 0}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                )}
                            </ScheduleCard>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

//
// 🔹 HELPERS
//

function summaryKey(title) {
    switch (title) {
        case "Applicants": return "totalApplicants";
        case "Hired": return "hired";
        case "Rejected": return "rejected";
        case "Open Jobs": return "openPositions";
        default: return title;
    }
}

const TONE_CLASSES = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600"
};

//
// 🔹 COMPONENTS
//

function SummaryCard({ title, data, icon: Icon, tone }) {
    const isPositive = data.change >= 0;

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 transition-all hover:shadow-sm hover:border-gray-300">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{title}</p>
                {Icon && (
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${TONE_CLASSES[tone] ?? TONE_CLASSES.emerald}`}>
                        <Icon size={16} />
                    </span>
                )}
            </div>

            <p className="text-2xl font-semibold mt-3 text-gray-900 tabular-nums">
                {data.current.toLocaleString()}
            </p>

            <div className={`flex items-center gap-1 text-sm mt-2 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span className="font-medium">{Math.abs(data.percentChange)}%</span>
                <span className="text-gray-400 text-xs">vs last month</span>
            </div>
        </div>
    );
}

function ScheduleCard({ title, count, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-6 transition-shadow hover:shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-gray-800">{title}</h2>
                {count > 0 && (
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {count}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}

function Avatar({ firstName, lastName }) {
    const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
    return (
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center justify-center shrink-0">
            {initials || "?"}
        </div>
    );
}

function Empty({ text, icon: Icon }) {
    return (
        <div className="text-center py-8 text-gray-400 text-sm flex flex-col items-center gap-2">
            {Icon && <Icon size={24} className="text-gray-300" />}
            {text}
        </div>
    );
}

function ErrorState({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <AlertTriangle size={28} className="text-red-400 mb-3" />
            <p className="text-gray-600 text-sm max-w-sm">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 rounded-lg px-3.5 py-1.5 transition-colors"
                >
                    <RefreshCw size={14} />
                    Try again
                </button>
            )}
        </div>
    );
}