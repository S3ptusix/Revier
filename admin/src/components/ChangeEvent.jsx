import { Calendar, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    addToEvent,
    fetchAllOrientationEventCE
} from "../services/orientationsServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import {
    Modal,
    ModalBackground,
    ModalHeader
} from "./ui/ui-modal";

export default function ChangeEvent({
    applicantId,
    onClose = () => {},
    loadAfter = () => {}
}) {
    const [orientations, setOrientations] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [selectedOrientation, setSelectedOrientation] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSelect = (orientation) => {
        setSelectedOrientation(orientation);
        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        if (!selectedOrientation) return;

        setLoading(true);

        try {
            const { success, message } = await addToEvent(applicantId, {
                orientationId: selectedOrientation.id,
            });

            if (success) {
                toast.success(message, {
                    toastId: "success-submit",
                });

                setShowConfirmModal(false);
                setSelectedOrientation(null);

                loadAfter();
                onClose();
                return;
            }

            toast.error(message);
        } catch (error) {
            console.error("Error changing orientation:", error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadOrientations = async () => {
            try {
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
                    return;
                }

                console.error(message);
            } catch (error) {
                console.error(error);
            }
        };

        loadOrientations();
    }, [page, applicantId]);

    return (
        <>
            <div className="modal-style">
                <div className="flex h-screen flex-col">
                    <button className="onClose-btn" onClick={onClose}>
                        <X size={16} />
                    </button>

                    <p className="text-lg font-semibold">
                        Change Event
                    </p>

                    <p className="mb-8 text-sm text-gray-500">
                        Select an event this applicant should attend.
                    </p>

                    <div className="grow space-y-4 overflow-auto">
                        {orientations.length > 0 ? (
                            orientations.map((orientation) => (
                                <div
                                    key={orientation.id}
                                    onClick={() => handleSelect(orientation)}
                                    className="group cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 transition duration-150 hover:bg-emerald-500 hover:text-white"
                                >
                                    <p className="text-lg font-semibold">
                                        {orientation.eventTitle}
                                    </p>

                                    <div className="mt-4 flex justify-between gap-y-2 max-md:flex-col md:items-center">
                                        <div className="flex items-center gap-2 text-gray-500 duration-150 group-hover:text-white">
                                            <Calendar
                                                size={16}
                                                className="shrink-0"
                                            />
                                            <p className="text-sm">
                                                {cleanDateTime(
                                                    orientation.eventAt
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-500 duration-150 group-hover:text-white">
                                            <MapPin
                                                size={16}
                                                className="shrink-0"
                                            />
                                            <p className="text-sm">
                                                {orientation.location}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-lg border border-dashed py-10 text-center text-gray-500">
                                No available orientation events.
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <Pagination
                            pagination={pagination}
                            page={page}
                            setPage={setPage}
                        />
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Confirm Change Event"
                            onClose={() => {
                                setShowConfirmModal(false);
                                setSelectedOrientation(null);
                            }}
                        />

                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to move this applicant to
                                the following orientation event?
                            </p>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <p className="text-lg font-semibold">
                                    {selectedOrientation?.eventTitle}
                                </p>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} />
                                        <span>
                                            {cleanDateTime(
                                                selectedOrientation?.eventAt
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin size={16} />
                                        <span>
                                            {selectedOrientation?.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedOrientation(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Changing..."
                                        : "Change Event"}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}