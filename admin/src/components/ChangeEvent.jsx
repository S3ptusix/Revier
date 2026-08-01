import { Calendar, MapPin, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllOrientationEventCE } from "../services/orientationsServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import {
    ModalBackground,
    Modal,
    ModalHeader
} from "./ui/ui-modal";
import { forOrientation } from "../services/interviewServices";

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
            const { success, message } = await forOrientation(applicantId, {
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

                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        title="Change Event"
                        subTitle="Select a new orientation event"
                        onClose={onClose}
                    />
                </div>

                {/* 🔥 CURRENT EVENT (UPGRADED) */}
                {currentEvent && (
                    <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                            Current Event
                        </p>

                        <p className="font-semibold text-gray-900">
                            {currentEvent.eventTitle}
                        </p>

                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                {cleanDateTime(currentEvent.eventAt)}
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                {currentEvent.location}
                            </div>
                        </div>
                    </div>
                )}

                {/* LIST */}
                <div className="space-y-3 max-h-75 overflow-y-auto pr-1">

                    {isFetching ? (
                        <div className="text-center text-gray-400 py-10">
                            Loading events...
                        </div>
                    ) : orientations.length > 0 ? (
                        orientations.map((orientation) => {
                            const isSelected =
                                selectedOrientation?.id === orientation.id;

                            const isCurrent =
                                currentEvent?.id === orientation.id;

                            return (
                                <div
                                    key={orientation.id}
                                    onClick={() => setSelectedOrientation(orientation)}
                                    className={`
                                group relative border rounded-xl p-4 cursor-pointer transition
                                ${isSelected
                                            ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                            : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"}
                                ${isCurrent ? "opacity-60 cursor-not-allowed" : ""}
                            `}
                                >
                                    {/* CURRENT TAG */}
                                    {isCurrent && (
                                        <span className="absolute top-3 left-3 text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                            Current
                                        </span>
                                    )}

                                    {/* SELECT INDICATOR */}
                                    {!isCurrent && (
                                        <div
                                            className={`
                                        absolute top-3 right-3 flex items-center justify-center
                                        w-5 h-5 rounded-full border
                                        ${isSelected
                                                    ? "bg-emerald-500 border-emerald-500"
                                                    : "border-gray-300 group-hover:border-emerald-400"}
                                    `}
                                        >
                                            {isSelected && (
                                                <Check className="text-white" size={12} />
                                            )}
                                        </div>
                                    )}

                                    {/* TITLE */}
                                    <p className="text-sm font-semibold text-gray-900">
                                        {orientation.eventTitle}
                                    </p>

                                    {/* META */}
                                    <div className="mt-2 space-y-1 text-xs text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {cleanDateTime(orientation.eventAt)}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} />
                                            <span className="truncate">
                                                {orientation.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="rounded-xl border border-dashed py-12 text-center text-gray-500">
                            No available orientation events.
                        </div>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="mt-4">
                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                        hide
                    />
                </div>

                {/* ACTION BAR */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 mt-5 pt-3 flex items-center justify-between gap-3">

                    <div className="text-sm">
                        {selectedOrientation ? (
                            <p className="text-gray-700">
                                New Event:{" "}
                                <span className="font-medium text-gray-900">
                                    {selectedOrientation.eventTitle}
                                </span>
                            </p>
                        ) : (
                            <p className="text-gray-400">
                                No new event selected
                            </p>
                        )}
                    </div>

                    <button
                        disabled={
                            !selectedOrientation ||
                            loading ||
                            selectedOrientation?.id === currentEvent?.id
                        }
                        onClick={handleSubmit}
                        className={`
                    btn px-5 rounded-lg text-white transition
                    ${selectedOrientation &&
                                selectedOrientation?.id !== currentEvent?.id
                                ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                                : "bg-gray-300 cursor-not-allowed"}
                `}
                    >
                        {loading ? "Updating..." : "Change Event"}
                    </button>
                </div>

            </Modal>
        </ModalBackground>
    );
}