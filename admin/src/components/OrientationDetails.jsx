import { useEffect, useState } from "react";
import { deleteOrientationEvent, fetchOneOrientationEvent } from "../services/orientationsServices";
import { Modal, ModalBackground, ModalBody, ModalBodyError, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { formatShortDateTime } from "../utils/format";
import { Calendar, MapPin, Pencil, Users, Video, FileText, Inbox, Trash2, AlertTriangle } from "lucide-react";
import EditEvent from "./EditEvent";
import TrackAttendance from "./TrackAttendance";
import Loading from "./Loading";
import { toast } from "react-toastify";

export default function OrientationDetails({
    orientationId: selectedOrientationId,
    onClose = () => { },
    loadEvents = () => { }
}) {
    const [eventDetails, setEventDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);

    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDeleteEvent = async (id) => {
        try {
            setIsDeleting(true);
            const { success, message } = await deleteOrientationEvent(id);
            if (success) {
                toast.success(message || "Event deleted");
                setOpenDeleteConfirm(false);
                onClose();
                loadEvents();
            } else {
                toast.error(message || "Couldn't delete this event");
            }
        } catch (error) {
            toast.error("Couldn't delete this event");
            console.error(error);
        } finally {
            setIsDeleting(false);
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
                <Modal maxWidth={480}>
                    <ModalHeader
                        title="Orientation Details"
                        onClose={onClose}
                    />
                    <ModalBody>

                        {isLoading ? (
                            <div className="p-16 flex justify-center">
                                <Loading />
                            </div>
                        ) : eventDetails ? (
                            <>

                                {/* TITLE */}
                                <div className="space-y-1">
                                    <h2 className="text-xl font-bold text-gray-900 leading-snug">
                                        {eventDetails.eventTitle}
                                    </h2>
                                    {eventDetails.eventAt && (
                                        <p className="text-sm text-gray-500">
                                            {formatShortDateTime(eventDetails.eventAt)}
                                        </p>
                                    )}
                                </div>

                                {/* INFO SECTION */}
                                <div className="grid grid-cols-1 gap-2.5 bg-gray-50 rounded-xl p-4">

                                    <InfoRow
                                        icon={<Calendar size={16} className="text-emerald-600" />}
                                        label="Date & time"
                                        value={eventDetails.eventAt && formatShortDateTime(eventDetails.eventAt)}
                                    />

                                    <InfoRow
                                        icon={<Video size={16} className="text-emerald-600" />}
                                        label="Mode"
                                        value={eventDetails.eventMode}
                                    />

                                    <InfoRow
                                        icon={<MapPin size={16} className="text-emerald-600" />}
                                        label="Location"
                                        value={eventDetails.location}
                                    />

                                    <InfoRow
                                        icon={<Users size={16} className="text-emerald-600" />}
                                        label="Attendees"
                                        value={`${eventDetails.attendeesCount} registered`}
                                        last
                                    />

                                </div>

                                {/* NOTE */}
                                {eventDetails.note && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5">
                                        <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide">
                                            <FileText size={12} />
                                            Note
                                        </p>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {eventDetails.note}
                                        </p>
                                    </div>
                                )}

                                {/* ACTIONS */}
                                <div className="flex gap-2 pt-1">

                                    {/* PRIMARY */}
                                    <button
                                        className="flex-1 btn bg-emerald-500 active:bg-emerald-700 text-white rounded-xl shadow-sm"
                                        onClick={() => handleTrackAttendance(eventDetails.id)}
                                    >
                                        Track Attendance
                                    </button>

                                    {/* SECONDARY */}
                                    <button
                                        className="btn btn-square rounded-xl bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700"
                                        onClick={() => handleEditEvent(eventDetails.id)}
                                        aria-label="Edit event"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>

                                {/* DANGER ZONE */}
                                <div className="pt-1 border-t border-gray-300">
                                    <button
                                        className="btn border-none shadow-none w-full text-sm text-red-600 hover:bg-red-50 active:bg-red-100 rounded-lg mt-3"
                                        onClick={() => setOpenDeleteConfirm(true)}
                                    >
                                        <Trash2 size={15} />
                                        Delete event
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
                                <Inbox size={28} strokeWidth={1.5} />
                                <p className="text-sm text-gray-500">No event details found</p>
                            </div>
                        )}
                    </ModalBody>
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

            {/* DELETE CONFIRMATION */}
            {openDeleteConfirm && (
                <ModalBackground>
                    <Modal>
                        <ModalBodyError
                            title="Delete this orientation?"
                            subTitle="You're about to permanently delete Cavite Industrial Orientation. This can't be undone."
                        />
                        <ModalFooter
                            submitLabel={isDeleting ? "Deleting..." : "Delete event"}
                            onSubmit={() => handleDeleteEvent(eventDetails.id)}
                            onClose={() => setOpenDeleteConfirm(false)}
                            disableSubmit={isDeleting}
                            submitColor="RED"
                        />
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}

function InfoRow({ icon, label, value, last = false }) {
    return (
        <div className={`flex items-center gap-3 ${!last ? "pb-2.5 border-b border-gray-200/70" : ""}`}>
            <div className="shrink-0">{icon}</div>
            <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
                <p className="text-sm text-gray-800 truncate">{value || "—"}</p>
            </div>
        </div>
    );
}