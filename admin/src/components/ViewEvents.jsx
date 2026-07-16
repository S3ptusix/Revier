/* eslint-disable react-hooks/exhaustive-deps */
import { Calendar, CalendarPlus, MapPin, Pencil, UserRound, X } from "lucide-react";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import NoData from "./ui/NoData";
import { useEffect, useState } from "react";
import { fetchAllMonthOrientationEvent } from "../services/orientationsServices";;
import { generateCalendar, getCurrentMonthYear } from "../utils/tools";
import Input from "./ui/Input";
import AddEvent from "./AddEvent";
import Loading from "./Loading";
import ViewOrientation from "./ViewOrientation";

export default function ViewEvents({
    onClose = () => { },
}) {
    const [date, setDate] = useState(getCurrentMonthYear);
    const [dateMatrix, setDateMatrix] = useState([]);
    const [data, setData] = useState([]);

    const [orientationId, setOrientationId] = useState(null);
    const [openOrientation, setOpenOrientation] = useState(false);
    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const loadOrientation = async (orientationId) => {
        setOrientationId(orientationId);
        setOpenOrientation(true);
    }

    const loadEvents = async () => {
        try {
            const { success, message, orientationEvents } = await fetchAllMonthOrientationEvent({ monthDay: date });
            if (success) {
                setData(orientationEvents);
                return
            }
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const [year, month] = date.split("-").map(Number);
        setDateMatrix(generateCalendar(year, month));
        loadEvents();
    }, [date]);

    return (
        <>
            <ModalBackground>
                <Modal
                    maxWidth={1000}
                >
                    <ModalHeader
                        title="Orientation Events"
                        onClose={onClose}
                    />
                    <section className="grid grid-cols-2 gap-4 my-4">
                            <button
                                className="btn bg-emerald-500 text-white rounded-xl w-full"
                                onClick={() => setOpenCreateEvent(true)}
                            >
                                <CalendarPlus size={16} /> Add Event
                            </button>
                            <Input
                                name="date"
                                type="month"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                    </section>
                    <section>
                        <table className="w-full border-collapse table-fixed">
                            <thead>
                                <tr>
                                    {["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"].map((day) => (
                                        <th
                                            key={day}
                                            className="border border-gray-300 bg-blue-500 text-white p-2 text-xs"
                                        >
                                            <p className="lg:hidden">{day.slice(0, 3)}</p>
                                            <p className="max-lg:hidden">{day}</p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {dateMatrix?.map((week, weekIndex) => (
                                    <tr key={weekIndex}>
                                        {week.map((day, dayIndex) => {
                                            const formattedDate = `${date}-${String(day).padStart(2, "0")}`;

                                            const events = data.filter(
                                                (event) =>
                                                    cleanDateTime(event.eventAt).split(" ")[0] === formattedDate
                                            );

                                            return (
                                                <td
                                                    key={dayIndex}
                                                    className={`align-top min-h-30 h-30 border border-gray-300 p-2 ${day ? '' : 'bg-gray-200'}`}
                                                >
                                                    {day && (
                                                        <>
                                                            <p className="text-xs mb-1">{day}</p>

                                                            <div className="space-y-1">
                                                                {events.map((event) => (
                                                                    <button
                                                                        key={event.id}
                                                                        className="cursor-pointer bg-emerald-500 text-white rounded-md w-full"
                                                                        onClick={() => loadOrientation(event.id)}
                                                                    >
                                                                        <p className="text-left text-xs truncate m-0.5 font-semibold">
                                                                            {event.eventTitle}
                                                                        </p>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </Modal>
            </ModalBackground>
            {openOrientation && (
                <ViewOrientation
                    orientationId={orientationId}
                    onClose={() => setOpenOrientation(false)}
                    loadEvents={loadEvents}
                />
            )}
            {openCreateEvent && (
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                    loadAfter={loadEvents}
                />
            )}
        </>
    )
}