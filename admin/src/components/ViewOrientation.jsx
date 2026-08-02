import { useEffect, useState } from "react";
import { fetchOneOrientationEvent } from "../services/orientationsServices";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { formatShortDateTime } from "../utils/format";
import { Calendar, MapPin, Pencil, Users } from "lucide-react";
import EditEvent from "./EditEvent";
import TrackAttendance from "./TrackAttendance";
import Loading from "./Loading";

export default function ViewOrientation({
    orientationId: selectedOrientationId,
    onClose = () => { },
    loadEvents = () => { }
}) {
    const [eventDetails, setEventDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);

    const handleEditEvent = (id) => {
        setOrientationId(id);
        setOpenEditEvent(true);
    };

    const handleTrackAttendance = (id) => {
        setOrientationId(id);
        setOpenTrackAttendance(true);
    };

    const loadEventDetails = async (id) => {
        try {
            setIsLoading(true);
            const { success, message, orientation } = await fetchOneOrientationEvent(id);

            if (success) {
                setEventDetails(orientation);
            } else {
                console.error(message);
                setEventDetails(null);
            }
        } catch (error) {
            console.error(error);
            setEventDetails(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedOrientationId) {
            loadEventDetails(selectedOrientationId);
        }
    }, [selectedOrientationId]);

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={500}>
                    <ModalHeader
                        title="Orientation Details"
                        onClose={onClose}
                    />

                    {/* LOADING */}
                    {isLoading ? (
                        <div className="py-10 flex justify-center">
                            <Loading />
                        </div>
                    ) : eventDetails ? (
                        <div className="p-5 bg-white rounded-xl space-y-4">

                            {/* TITLE */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">
                                    {eventDetails.eventTitle}
                                </h2>
                            </div>

                            {/* INFO SECTION */}
                            <div className="space-y-2 text-sm text-gray-600">

                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>
                                        {eventDetails.eventAt &&
                                            formatShortDateTime(eventDetails.eventAt)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin size={16} />
                                    <span>{eventDetails.location}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Users size={16} />
                                    <span>
                                        {eventDetails.attendeesCount} attendees
                                    </span>
                                </div>

                            </div>

                            {/* NOTE */}
                            {eventDetails.note && (
                                <div className="bg-gray-50 border rounded-lg p-3">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">
                                        NOTE
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        {eventDetails.note}
                                    </p>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex gap-2 pt-2">

                                {/* PRIMARY */}
                                <button
                                    className="flex-1 btn bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                                    onClick={() => handleTrackAttendance(eventDetails.id)}
                                >
                                    Track Attendance
                                </button>

                                {/* SECONDARY */}
                                <button
                                    className="btn btn-square rounded-xl bg-gray-800 hover:bg-black text-white"
                                    onClick={() => handleEditEvent(eventDetails.id)}
                                >
                                    <Pencil size={16} />
                                </button>

                            </div>
                        </div>
                    ) : (
                        <div className="py-10 text-center text-gray-500">
                            No event details found
                        </div>
                    )}
                </Modal>
            </ModalBackground>

            {/* EDIT EVENT */}
            {openEditEvent && (
                <EditEvent
                    orientationId={orientationId}
                    onClose={() => setOpenEditEvent(false)}
                    loadAfter={() => {
                        loadEvents();
                        loadEventDetails(orientationId);
                    }}
                />
            )}

            {/* TRACK ATTENDANCE */}
            {openTrackAttendance && (
                <TrackAttendance
                    orientationId={orientationId}
                    onClose={() => setOpenTrackAttendance(false)}
                    loadAfter={() => loadEventDetails(orientationId)}
                />
            )}
        </>
    );
}