import {
    BarChart,
    Bar,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import Sidemenu from "../components/Sidemenu";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/dashboardServices";
import {
    ArrowUp,
    ArrowDown,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Video,
    MapPin,
    CalendarX
} from "lucide-react";
import { socket } from "../socket";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDashboardData();
                setData(res);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("We couldn't load your dashboard data. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        socket.on("dashboard", fetchData);
        fetchData();

        return () => {
            socket.off("dashboard", fetchData);
        };
    }, []);

    return (
        <div className="flex h-screen bg-white">
            <Sidemenu />

            <div className="bg-gray-50 flex-1 overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : error ? (
                    <ErrorState message={error} />
                ) : !data ? (
                    <ErrorState message="No dashboard data available." />
                ) : (
                    <div className="p-8 space-y-10 animate-in fade-in duration-300">

                        {/* HEADER */}
                        <section>
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Dashboard
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Recruitment overview and activity
                            </p>
                        </section>

                        {/* ========================= */}
                        {/* SUMMARY */}
                        {/* ========================= */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <SummaryCard title="Applicants" data={data.summary.totalApplicants} />
                            <SummaryCard title="Hired" data={data.summary.hired} />
                            <SummaryCard title="Rejected" data={data.summary.rejected} />
                            <SummaryCard title="Open Jobs" data={data.summary.openPositions} />
                        </section>

                        {/* ========================= */}
                        {/* FUNNEL CHART */}
                        {/* ========================= */}
                        <section className="bg-white border border-gray-300 rounded-xl p-6 transition-shadow hover:shadow-sm">
                            <h2 className="font-semibold text-gray-700 mb-5">
                                Hiring Funnel
                            </h2>

                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { stage: "New", count: data.pipeline.New },
                                            { stage: "Interview", count: data.pipeline.Interview },
                                            { stage: "Orientation", count: data.pipeline.Orientation },
                                            { stage: "Hired", count: data.pipeline.Hired }
                                        ]}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />

                                        <XAxis dataKey="stage" tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />

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
                                            fill="#10b981" // emerald-500
                                            maxBarSize={64}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        {/* ========================= */}
                        {/* SCHEDULES */}
                        {/* ========================= */}
                        <section className="grid lg:grid-cols-2 gap-6">

                            {/* INTERVIEWS */}
                            <div className="bg-white border border-gray-300 rounded-xl p-6 transition-shadow hover:shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-semibold text-gray-700">
                                        Today's Interviews
                                    </h2>
                                    {data.schedules.interviewsToday.length > 0 && (
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            {data.schedules.interviewsToday.length}
                                        </span>
                                    )}
                                </div>

                                {data.schedules.interviewsToday.length === 0 ? (
                                    <Empty text="No interviews today" icon={CalendarX} />
                                ) : (
                                    <div className="space-y-2.5">
                                        {data.schedules.interviewsToday.map(item => (
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
                            </div>

                            {/* ORIENTATIONS */}
                            <div className="bg-white border border-gray-300 rounded-xl p-6 transition-shadow hover:shadow-sm">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-semibold text-gray-700">
                                        Upcoming Orientations
                                    </h2>
                                    {data.schedules.upcomingOrientations.length > 0 && (
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                            {data.schedules.upcomingOrientations.length}
                                        </span>
                                    )}
                                </div>

                                {data.schedules.upcomingOrientations.length === 0 ? (
                                    <Empty text="No upcoming orientations" icon={CalendarX} />
                                ) : (
                                    <div className="space-y-2.5">
                                        {data.schedules.upcomingOrientations.map(event => {
                                            const eventDate = new Date(event.eventAt);
                                            const isToday = eventDate.toDateString() === new Date().toDateString();

                                            return (
                                                <div
                                                    key={event.id}
                                                    className="border border-gray-200 rounded-lg p-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="font-medium text-gray-800">
                                                            {event.eventTitle}
                                                        </p>
                                                        {isToday && (
                                                            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                                                                Today
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
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
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

//
// 🔹 COMPONENTS
//

function SummaryCard({ title, data }) {
    const isPositive = data.change >= 0;

    return (
        <div className="bg-white border border-gray-300 rounded-xl p-5 transition-shadow hover:shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>

            <p className="text-2xl font-semibold mt-2 text-gray-800">
                {data.current.toLocaleString()}
            </p>

            <div className={`flex items-center gap-1 text-sm mt-2 ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                <span>{Math.abs(data.percentChange)}%</span>
                <span className="text-gray-400 text-xs">vs last month</span>
            </div>
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

function ErrorState({ message }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <AlertTriangle size={28} className="text-red-400 mb-3" />
            <p className="text-gray-600 text-sm max-w-sm">{message}</p>
        </div>
    );
}