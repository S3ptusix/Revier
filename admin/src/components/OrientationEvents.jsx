/* eslint-disable react-hooks/exhaustive-deps */
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { formatToLocal, toStandardTimeFull } from "../utils/format";
import { Modal, ModalBackground, ModalBody, ModalHeader } from "./ui/ui-modal";
import NoData from "./ui/NoData";
import { useEffect, useMemo, useState } from "react";
import { fetchAllMonthOrientationEvent } from "../services/orientationsServices";
import { generateCalendar, getCurrentMonthYear } from "../utils/tools";
import Input from "./ui/Input";
import AddEvent from "./AddEvent";
import Loading from "./Loading";
import OrientationDetails from "./OrientationDetails";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MAX_VISIBLE_EVENTS = 3;

export default function OrientationEvents({
    onClose = () => { },
}) {
    const [date, setDate] = useState(getCurrentMonthYear);
    const [dateMatrix, setDateMatrix] = useState([]);
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openOrientation, setOpenOrientation] = useState(false);
    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const todayStr = new Date().toLocaleDateString("en-CA");

    const monthLabel = useMemo(() => {
        const [year, month] = date.split("-").map(Number);
        return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    }, [date]);

    const shiftMonth = (offset) => {
        const [year, month] = date.split("-").map(Number);
        const next = new Date(year, month - 1 + offset, 1);
        setDate(
            `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`
        );
    };

    const loadOrientation = async (orientationId) => {
        setOrientationId(orientationId);
        setOpenOrientation(true);
    };

    const loadEvents = async () => {
        try {
            setIsLoading(true);
            const { success, message, orientationEvents } =
                await fetchAllMonthOrientationEvent({ monthDay: date });

            if (success) {
                setData(orientationEvents);
                return;
            }

            console.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const [year, month] = date.split("-").map(Number);
        setDateMatrix(generateCalendar(year, month));
        loadEvents();
    }, [date]);

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={1100}>
                    <ModalHeader title="Orientation Events" onClose={onClose} />

                    <ModalBody>


                        {/* HEADER CONTROLS */}
                        <section className="flex flex-wrap items-center justify-between gap-3 my-4">
                            <button
                                className="btn bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-xl flex items-center gap-2 px-4 py-2 font-medium shadow-sm shadow-emerald-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                                onClick={() => setOpenCreateEvent(true)}
                            >
                                <CalendarPlus size={16} />
                                Add Event
                            </button>

                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden">
                                    <button
                                        type="button"
                                        aria-label="Previous month"
                                        onClick={() => shiftMonth(-1)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <span className="min-w-36 text-center text-sm font-semibold text-gray-800 select-none px-2">
                                        {monthLabel}
                                    </span>

                                    <button
                                        type="button"
                                        aria-label="Next month"
                                        onClick={() => shiftMonth(1)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <Input
                                    name="date"
                                    type="month"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-auto!"
                                />
                            </div>
                        </section>

                        {/* LOADING */}
                        {isLoading ? (
                            <div className="py-16 flex justify-center">
                                <Loading />
                            </div>
                        ) : (
                            <section className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full table-fixed border-collapse">
                                    {/* HEADER */}
                                    <thead className="sticky top-0 z-10">
                                        <tr>
                                            {WEEKDAYS.map((day) => (
                                                <th
                                                    key={day}
                                                    className="bg-gray-800 text-gray-200 p-2 text-[11px] font-semibold tracking-wider"
                                                >
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    {/* BODY */}
                                    <tbody>
                                        {dateMatrix.map((week, weekIndex) => (
                                            <tr key={weekIndex}>
                                                {week.map((day, dayIndex) => {
                                                    const formattedDate = `${date}-${String(day).padStart(2, "0")}`;

                                                    const events = data.filter(
                                                        (event) =>
                                                            formatToLocal(event.eventAt).split(" ")[0] ===
                                                            formattedDate
                                                    );

                                                    const isToday = formattedDate === todayStr;
                                                    const isWeekend = dayIndex === 0 || dayIndex === 6;
                                                    const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
                                                    const hiddenCount = events.length - visibleEvents.length;

                                                    return (
                                                        <td
                                                            key={dayIndex}
                                                            className={`
                                                            align-top h-32 p-1.5 border border-gray-100
                                                            ${day ? (isWeekend ? "bg-gray-50/60" : "bg-white") : "bg-gray-50"}
                                                            ${day ? "hover:bg-emerald-50/50 transition-colors" : ""}
                                                            ${isToday ? "ring-2 ring-inset ring-emerald-500" : ""}
                                                        `}
                                                        >
                                                            {day ? (
                                                                <div className="flex flex-col h-full">
                                                                    {/* DAY NUMBER */}
                                                                    <div className="flex justify-between items-center mb-1 px-0.5">
                                                                        <span
                                                                            className={`flex items-center justify-center text-xs font-semibold rounded-full ${isToday
                                                                                ? "bg-emerald-500 text-white w-5 h-5"
                                                                                : "text-gray-500"
                                                                                }`}
                                                                        >
                                                                            {day}
                                                                        </span>

                                                                        {events.length > 0 && (
                                                                            <span className="text-[10px] font-medium text-gray-400">
                                                                                {events.length} {events.length === 1 ? "event" : "events"}
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* EVENTS */}
                                                                    <div className="space-y-1 overflow-hidden">
                                                                        {visibleEvents.length > 0 ? (
                                                                            <>
                                                                                {visibleEvents.map((event) => {
                                                                                    const time =
                                                                                        formatToLocal(
                                                                                            event.eventAt
                                                                                        ).split(" ")[1];
                                                                                        
                                                                                    return (
                                                                                        <button
                                                                                            key={event.id}
                                                                                            onClick={() =>
                                                                                                loadOrientation(event.id)
                                                                                            }
                                                                                            className="w-full text-left bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-2 py-1 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                                                                                        >
                                                                                            <p className="text-[10px] opacity-80 leading-tight">
                                                                                                {toStandardTimeFull(time)}
                                                                                            </p>
                                                                                            <p className="text-xs font-semibold truncate leading-tight">
                                                                                                {event.eventTitle}
                                                                                            </p>
                                                                                        </button>
                                                                                    );
                                                                                })}

                                                                                {hiddenCount > 0 && (
                                                                                    <p className="text-[10px] font-medium text-gray-400 px-2">
                                                                                        +{hiddenCount} more
                                                                                    </p>
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <p className="text-[10px] text-gray-300 italic px-0.5">
                                                                                No events
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* GLOBAL EMPTY STATE */}
                                {!data.length && (
                                    <div className="py-6 border-t border-gray-100">
                                        <NoData message="No events this month" />
                                    </div>
                                )}
                            </section>
                        )}
                    </ModalBody>
                </Modal>
            </ModalBackground>

            {/* VIEW EVENT */}
            {openOrientation && (
                <OrientationDetails
                    orientationId={orientationId}
                    onClose={() => setOpenOrientation(false)}
                    loadEvents={loadEvents}
                />
            )}

            {/* ADD EVENT */}
            {openCreateEvent && (
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                    loadAfter={loadEvents}
                />
            )}
        </>
    );
}