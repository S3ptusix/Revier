/* eslint-disable react-hooks/exhaustive-deps */
import { Calendar, MapPin, Pencil, X } from "lucide-react";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import NoData from "./ui/NoData";
import { useEffect, useState } from "react";
import { fetchAllOrientationEvent } from "../services/orientationsServices";
import TrackAttendance from "./TrackAttendance";
import EditEvent from "./EditEvent";

export default function ViewEvents({
    onClose = () => { },
}) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);

    const handleEditEvent = (orientationId) => {
        setOrientationId(orientationId);
        setOpenEditEvent(true);
    }

    const handleTrackAttendance = (orientationId) => {
        setOrientationId(orientationId);
        setOpenTrackAttendance(true);
    }

    const loadEvents = async () => {
        const { success, message, orientationEvents, pagination: apiPagination } = await fetchAllOrientationEvent({ page });
        if (success) {
            setData(orientationEvents);
            setPagination(apiPagination);
            return
        }
        console.error(message);
    }
    useEffect(() => {
        try {
            loadEvents();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <>
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Scheduled Orientation Events"
                        onClose={onClose}
                    />
                    <div className="flex flex-col gap-2 my-4">
                        {data.length > 0 ? (
                            data?.map(event => (
                                <div key={event?.id} className="border border-gray-300 p-2 rounded-xl">

                                    <p className="text-lg font-semibold">{event?.eventTitle}</p>

                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={16} />
                                        {<p className="text-sm">{event?.eventAt ? cleanDateTime(event?.eventAt) : 'No Schedule Yet'}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin size={16} />
                                        <p className="text-sm">{event?.location}</p>
                                    </div>

                                    <p className="font-semibold text-sm my-2">{event?.applicants?.length} Attendees</p>

                                    <div className="flex gap-2">
                                        <button
                                            className="grow btn bg-emerald-500 text-white rounded-lg"
                                            onClick={() => handleTrackAttendance(event?.id)}
                                        >
                                            Track Attendance
                                        </button>
                                        <div className="tooltip" data-tip="Edit Event">
                                            <button
                                                className="btn rounded-lg"
                                                onClick={() => handleEditEvent(event?.id)}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg overflow-hidden">
                                <NoData message="NO ORIENTATION EVENT FOUND" />
                            </div>
                        )
                        }
                    </div>
                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                    />
                </Modal>
            </ModalBackground>
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

        </>
    )
}