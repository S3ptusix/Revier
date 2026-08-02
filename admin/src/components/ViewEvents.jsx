/* eslint-disable react-hooks/exhaustive-deps */
import { CalendarPlus } from "lucide-react";
import { formatToLocal } from "../utils/format";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import NoData from "./ui/NoData";
import { useEffect, useState } from "react";
import { fetchAllMonthOrientationEvent } from "../services/orientationsServices";
import { generateCalendar, getCurrentMonthYear } from "../utils/tools";
import Input from "./ui/Input";
import AddEvent from "./AddEvent";
import Loading from "./Loading";
import ViewOrientation from "./ViewOrientation";

export default function ViewEvents({ onClose = () => { } }) {
    const [date, setDate] = useState(getCurrentMonthYear);
    const [dateMatrix, setDateMatrix] = useState([]);
    const [data, setData] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openOrientation, setOpenOrientation] = useState(false);
    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const todayStr = new Date().toLocaleDateString("en-CA");

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

                    {/* HEADER CONTROLS */}
                    <section className="flex items-center justify-between gap-3 my-4">
                        <button
                            className="btn bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2 px-4"
                            onClick={() => setOpenCreateEvent(true)}
                        >
                            <CalendarPlus size={16} />
                            Add Event
                        </button>

                        <Input
                            name="date"
                            type="month"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </section>

                    {/* LOADING */}
                    {isLoading ? (
                        <div className="py-10 flex justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <section className="border border-gray-300 rounded-lg overflow-hidden">
                            <table className="w-full table-fixed">
                                {/* HEADER */}
                                <thead className="sticky top-0 z-10">
                                    <tr>
                                        {[
                                            "SUN",
                                            "MON",
                                            "TUE",
                                            "WED",
                                            "THU",
                                            "FRI",
                                            "SAT"
                                        ].map((day) => (
                                            <th
                                                key={day}
                                                className="bg-gray-800 text-white p-2 text-xs font-semibold"
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

                                                const isToday =
                                                    formattedDate === todayStr;

                                                return (
                                                    <td
                                                        key={dayIndex}
                                                        className={`
                                                            align-top h-32 p-2
                                                            ${day ? "bg-white hover:bg-gray-100" : "bg-gray-200"}
                                                            ${isToday ? "ring-2 ring-emerald-500" : ""}
                                                        `}
                                                    >
                                                        {day ? (
                                                            <>
                                                                {/* DAY NUMBER */}
                                                                <div className="flex justify-between items-center mb-1">
                                                                    <span
                                                                        className={`text-xs font-semibold ${isToday
                                                                                ? "text-emerald-600"
                                                                                : "text-gray-600"
                                                                            }`}
                                                                    >
                                                                        {day}
                                                                    </span>

                                                                    {isToday && (
                                                                        <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1 rounded">
                                                                            TODAY
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* EVENTS */}
                                                                <div className="space-y-1">
                                                                    {events.length > 0 ? (
                                                                        events.map((event) => {
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
                                                                                    className="w-full text-left bg-emerald-500 hover:bg-emerald-600 text-white rounded-md px-2 py-1 cursor-pointer"
                                                                                >
                                                                                    <p className="text-[10px] opacity-80">
                                                                                        {time}
                                                                                    </p>
                                                                                    <p className="text-xs font-semibold truncate">
                                                                                        {event.eventTitle}
                                                                                    </p>
                                                                                </button>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <p className="text-[10px] text-gray-400 italic">
                                                                            No events
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </>
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
                                <div className="py-6">
                                    <NoData message="No events this month" />
                                </div>
                            )}
                        </section>
                    )}
                </Modal>
            </ModalBackground>

            {/* VIEW EVENT */}
            {openOrientation && (
                <ViewOrientation
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