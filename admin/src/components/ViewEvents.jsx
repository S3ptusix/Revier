/* eslint-disable react-hooks/exhaustive-deps */
import { Calendar, CalendarPlus, MapPin, Pencil, UserRound, X } from "lucide-react";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import NoData from "./ui/NoData";
import { useEffect, useState } from "react";
import { fetchAllMonthOrientationEvent, fetchOneOrientationEvent } from "../services/orientationsServices";
import TrackAttendance from "./TrackAttendance";
import EditEvent from "./EditEvent";
import { generateCalendar, getCurrentMonthYear } from "../utils/tools";
import Input from "./ui/Input";
import AddEvent from "./AddEvent";
import Loading from "./Loading";

export default function ViewEvents({
    onClose = () => { },
}) {
    const [date, setDate] = useState(getCurrentMonthYear);
    const [dateMatrix, setDateMatrix] = useState([]);
    const [data, setData] = useState([]);

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);
    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const [eventDetails, setEventDetails] = useState(null);

    const handleEditEvent = (orientationId) => {
        setOrientationId(orientationId);
        setOpenEditEvent(true);
    }

    const handleTrackAttendance = (orientationId) => {
        setOrientationId(orientationId);
        setOpenTrackAttendance(true);
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

    const loadEventDetails = async (orientationId) => {
        try {
            const { success, message, orientation } = await fetchOneOrientationEvent(orientationId);
            if (success) {
                setEventDetails(orientation);
            } else {
                console.error(message);
            }
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
            <div className="fixed inset-0 z-999 flex bg-white h-screen w-full">
                <section>
                    <table className="h-full w-full border-collapse table-fixed">
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
                                                                    onClick={() => loadEventDetails(event.id)}
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
                <section className="flex flex-col space-y-8 bg-emerald-500 p-4 min-w-75">
                    <div className="flex justify-end">
                        <button
                            className="cursor-pointer text-white rounded-xl"
                            onClick={onClose}
                        >
                            <X />
                        </button>
                    </div>
                    <div className="grow flex flex-col space-y-4 overflow-auto">
                        <button
                            className="btn text-emerald-500 rounded-xl w-full"
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
                        {eventDetails ? (
                        <div className="p-4 bg-white rounded-xl grow overflow-auto">
                            <p className="mb-4 font-semibold">{eventDetails?.eventTitle}</p>
                            <p className="text-sm flex gap-2 items-center"><Calendar size={16} /> {eventDetails?.eventAt && cleanDateTime(eventDetails?.eventAt)}</p>
                            <p className="text-sm flex gap-2 items-center mb-4"><MapPin size={16} /> {eventDetails?.location}</p>
                            <p className="text-sm mb-4">Attendees: {eventDetails?.attendeesCount}</p>
                            {eventDetails?.note && (
                                <>
                                    <p className="text-sm">NOTE:</p>
                                    <p className="text-sm mb-4">{eventDetails?.note}</p>
                                </>
                            )}
                            <hr className="border-gray-300 mb-4" />
                            <div className="flex gap-2">
                                <button
                                    className="btn rounded-xl grow bg-blue-500 text-white mb-2"
                                    onClick={() => handleTrackAttendance(eventDetails?.id)}
                                >
                                    Track Attendance
                                </button>
                                <button
                                    className="btn btn-square rounded-xl bg-black text-white"
                                    onClick={() => handleEditEvent(eventDetails?.id)}
                                >
                                    <Pencil size={16} />
                                </button>
                            </div>
                        </div>
                        ) : (
                            <div className="p-4 flex-center bg-white text-emerald-500 font-semibold text-2xl rounded-xl grow overflow-auto">
                                Select an Event
                            </div>
                        )}
                    </div>
                </section>
            </div>
            {openEditEvent &&
                <EditEvent
                    orientationId={orientationId}
                    onClose={() => setOpenEditEvent(false)}
                    loadAfter={loadEvents}
                />
            }
            {openTrackAttendance &&
                <TrackAttendance
                    orientationId={orientationId}
                    onClose={() => setOpenTrackAttendance(false)}
                    loadAfter={loadEvents}
                />
            }
            {openCreateEvent && (
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                    loadAfter={loadEvents}
                />
            )}
        </>
    )
}