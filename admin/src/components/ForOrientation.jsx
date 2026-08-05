import { Calendar, MapPin, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    fetchAllOrientationEvent,
} from "../services/orientationsServices";
import Pagination from "./Pagination";
import {
    ModalBackground,
    Modal,
    ModalHeader,
    ModalBody,
    InfoList
} from "./ui/ui-modal";
import { forOrientation } from "../services/interviewServices";
import { formatShortDateTime } from "../utils/format";

export default function ForOrientation({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
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
                } = await fetchAllOrientationEvent({ page });

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
    }, [page]);

    return (
        <ModalBackground>
            <Modal>

                <ModalHeader
                    title="For Orientation"
                    subTitle="Select an event for this applicant"
                    onClose={onClose}
                />

                <ModalBody>

                    <InfoList
                        infoList={[
                            "Mark the interview as PASSED.",
                            "Move the applicant to the orientation stage.",
                            "Assign them to the selected event.",
                        ]}
                    />

                    {/* LIST */}
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">

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
                                    group relative border rounded-xl p-4 cursor-pointer transition
                                    ${isSelected
                                                ? "border-emerald-500 bg-emerald-50 shadow-sm"
                                                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40"}
                                `}
                                    >
                                        {/* SELECT INDICATOR */}
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

                                        {/* TITLE */}
                                        <p className="text-sm font-semibold text-gray-900">
                                            {orientation.eventTitle}
                                        </p>

                                        {/* META */}
                                        <div className="mt-2 space-y-1 text-xs text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {formatShortDateTime(orientation.eventAt)}
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


                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                        hide
                    />
                </ModalBody>

                <div className="flex justify-between gap-4 p-4 border-t border-gray-300">

                    <div className="text-sm">
                        {selectedOrientation ? (
                            <p className="text-gray-700">
                                Selected:{" "}
                                <span className="font-medium text-gray-900">
                                    {selectedOrientation.eventTitle}
                                </span>
                            </p>
                        ) : (
                            <p className="text-gray-400">
                                No event selected
                            </p>
                        )}
                    </div>

                    <button
                        disabled={!selectedOrientation || loading}
                        onClick={handleSubmit}
                        className={`
                        btn px-5 rounded-lg text-white transition
                        ${selectedOrientation
                                ? "bg-emerald-500 hover:bg-emerald-600 shadow-sm"
                                : "bg-gray-300 cursor-not-allowed"}
                    `}
                    >
                        {loading ? "Processing..." : "Mark as Passed & Add"}
                    </button>
                </div>

            </Modal>
        </ModalBackground>
    );
}