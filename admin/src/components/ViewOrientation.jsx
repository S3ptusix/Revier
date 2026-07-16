import { useEffect, useState } from "react";
import { fetchOneOrientationEvent } from "../services/orientationsServices";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { cleanDateTime } from "../utils/format";
import { Calendar, MapPin, Pencil } from "lucide-react";
import EditEvent from "./EditEvent";
import TrackAttendance from "./TrackAttendance";

export default function ViewOrientation({
    orientationId: selectedOrientationId,
    onClose = () => { },
    loadEvents = () => { }
}) {
    const [eventDetails, setEventDetails] = useState(null);

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

    const loadEventDetails = async (selectedOrientationId) => {
        try {
            const { success, message, orientation } = await fetchOneOrientationEvent(selectedOrientationId);
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
        loadEventDetails(selectedOrientationId);
    }, [selectedOrientationId]);

    return (
        <>
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Orientation Details"
                        onClose={onClose}
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
                        <p>Loading...</p>
                    )}
                </Modal>
            </ModalBackground>
            {openEditEvent &&
                <EditEvent
                    orientationId={orientationId}
                    onClose={() => setOpenEditEvent(false)}
                    loadAfter={() => {
                        loadEvents();
                        loadEventDetails(orientationId);
                    }}
                />
            }
            {openTrackAttendance &&
                <TrackAttendance
                    orientationId={orientationId}
                    onClose={() => setOpenTrackAttendance(false)}
                    loadAfter={() => loadEventDetails(orientationId)}
                />
            }
        </>
    )
}
