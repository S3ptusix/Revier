import { Calendar, MapPin, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    addToEvent,
    fetchAllOrientationEventCE
} from "../services/orientationsServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import {
    ModalBackground,
    Modal,
    ModalHeader
} from "./ui/ui-modal";

export default function ChangeEvent({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
    currentEvent // 👈 pass current event (important UX)
}) {
    const [orientations, setOrientations] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [selectedOrientation, setSelectedOrientation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const handleSubmit = async () => {
        if (!selectedOrientation) return;

        setLoading(true);

        try {
            const { success, message } = await addToEvent(applicantId, {
                orientationId: selectedOrientation.id,
            });

            if (success) {
                toast.success(message, { toastId: "success-submit" });
                loadAfter();
                onClose();
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadOrientations = async () => {
            try {
                setIsFetching(true);

                const {
                    success,
                    message,
                    orientationEvents,
                    pagination: apiPagination,
                } = await fetchAllOrientationEventCE({
                    applicantId,
                    page,
                });

                if (success) {
                    setOrientations(orientationEvents);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        loadOrientations();
    }, [page, applicantId]);

    return (
        <ModalBackground>
            <Modal>

                <div className="mb-8">
                    <ModalHeader
                        title="Change Event"
                        subTitle="Select a new orientation event"
                        onClose={onClose}
                    />
                </div>

                {/* CURRENT EVENT */}
                {currentEvent && (
                    <div className="mb-4 border rounded-lg p-3 bg-gray-50 text-sm">
                        <p className="text-gray-500 mb-1">
                            Current Event
                        </p>
                        <p className="font-semibold">
                            {currentEvent.eventTitle}
                        </p>
                        <p>{cleanDateTime(currentEvent.eventAt)}</p>
                        <p>{currentEvent.location}</p>
                    </div>
                )}

                {/* LIST */}
                <div className="space-y-4 mb-2">

                    {isFetching ? (
                        <div className="text-center text-gray-400 py-10">
                            Loading events...
                        </div>
                    ) : orientations.length > 0 ? (
                        orientations.map((orientation) => {
                            const isSelected =
                                selectedOrientation?.id === orientation.id;

                            return (
                                <div
                                    key={orientation.id}
                                    onClick={() => setSelectedOrientation(orientation)}
                                    className={`
                                        relative border rounded-lg p-4 cursor-pointer transition
                                        ${isSelected
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                                    `}
                                >
                                    {/* SELECTED */}
                                    {isSelected && (
                                        <Check
                                            className="absolute top-3 right-3 text-emerald-600"
                                            size={18}
                                        />
                                    )}

                                    <p className="font-semibold text-base">
                                        {orientation.eventTitle}
                                    </p>

                                    <div className="mt-3 space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {cleanDateTime(orientation.eventAt)}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} />
                                            {orientation.location}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-lg border border-dashed py-10 text-center text-gray-500">
                            No available orientation events.
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <Pagination
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                />

                {/* 🔥 ACTION BAR */}
                <div className="sticky bottom-0 bg-white border-t mt-4 pt-3 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {selectedOrientation
                            ? selectedOrientation.eventTitle
                            : "No event selected"}
                    </p>

                    <button
                        disabled={!selectedOrientation || loading}
                        onClick={handleSubmit}
                        className={`
                            btn px-5 text-white rounded-lg
                            ${selectedOrientation
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-gray-300 cursor-not-allowed"}
                        `}
                    >
                        {loading ? "Changing..." : "Change Event"}
                    </button>
                </div>
            </Modal>
        </ModalBackground>
    );
}