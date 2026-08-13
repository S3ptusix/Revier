/* eslint-disable react-hooks/exhaustive-deps */
import { X, CheckCircle, XCircle, Undo2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    applicantsFromOrientation,
    bulkEditOrientationStatus,
    bulkRemoveFromEvent,
} from "../services/orientationsServices";
import { Modal, ModalBackground, ModalBody, ModalHeader } from "./ui/ui-modal";
import Loading from "./Loading";
import NoData from "./ui/NoData";

export default function TrackAttendance({
    orientationId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // 🔥 track unsaved changes
    const [modified, setModified] = useState({});

    // 🗑️ removals are staged too — nothing hits the API until Save
    const [pendingRemovals, setPendingRemovals] = useState([]);

    const loadOrientations = async () => {
        try {
            setIsLoading(true);
            const { success, message, applicants } =
                await applicantsFromOrientation(orientationId);

            if (success) setApplicants(applicants);
            else console.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ LOCAL UPDATE ONLY (no API)
    const handleSubmit = (applicantId, orientationStatus) => {
        setApplicants(prev =>
            prev.map(a =>
                a.id === applicantId ? { ...a, orientationStatus } : a
            )
        );

        setModified(prev => ({
            ...prev,
            [applicantId]: orientationStatus
        }));
    };

    const handleToggleRemove = (applicantId) => {
        setPendingRemovals((prev) => {
            if (prev.includes(applicantId)) {
                return prev.filter((id) => id !== applicantId);
            }
            return [...prev, applicantId];
        });
    };

    const handleSaveAll = async () => {
        try {
            setIsSaving(true);

            const presentIds = Object.keys(modified).filter(id => modified[id] === "Present");
            const absentIds = Object.keys(modified).filter(id => modified[id] === "Absent");
            const removalIds = pendingRemovals;

            if (presentIds.length > 0) {
                const { success, message } = await bulkEditOrientationStatus({
                    applicantIds: presentIds,
                    orientationStatus: "Present"
                });
                if (!success) return toast.error(message);
            }

            if (absentIds.length > 0) {
                const { success, message } = await bulkEditOrientationStatus({
                    applicantIds: absentIds,
                    orientationStatus: "Absent"
                });
                if (!success) return toast.error(message);
            }

            if (removalIds.length > 0) {
                const { success, message } = await bulkRemoveFromEvent(removalIds);
                if (!success) return toast.error(message);
            }

            toast.success("Attendance saved");

            setModified({});
            setPendingRemovals([]); // reset to an empty array, not {}
            loadAfter();
            loadOrientations();

        } catch (error) {
            console.error(error);
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        loadOrientations();
    }, []);

    const hasChanges =
        Object.keys(modified).length > 0 ||
        pendingRemovals.length > 0;

    return (
        <ModalBackground>
            <Modal maxWidth={900}>
                <ModalHeader
                    title="Track Attendance"
                    subTitle="Mark attendance then save changes"
                    onClose={onClose}
                />

                {/* LOADING */}
                {isLoading ? (
                    <div className="p-16 flex justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        <ModalBody>
                            {applicants.length === 0 ? (
                                <NoData message="No applicants in this event" />
                            ) : (
                                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

                                    {applicants.map(applicant => {

                                        const isPendingRemoval = !!pendingRemovals.includes(applicant.id);

                                        const baseDisabled =
                                            applicant.applicantStatus === "Hired" ||
                                            applicant.orientationStatus !== null ||
                                            applicant.isRejected === true;

                                        // status editing is off if the applicant is otherwise
                                        // locked OR they're staged for removal
                                        const isDisabled = baseDisabled || isPendingRemoval;

                                        const status = applicant.orientationStatus;

                                        const isModified = modified[applicant.id];

                                        const isUpcoming =
                                            applicant?.orientationEvent?.eventAt &&
                                            new Date(applicant.orientationEvent.eventAt) > new Date();

                                        return (
                                            <div
                                                key={applicant.id}
                                                className={`
                                            relative border border-gray-300 rounded-xl p-3 flex flex-col gap-3
                                            transition hover:shadow-sm
                                            ${baseDisabled ? "brightness-75 bg-gray-50 pointer-events-none" : ""}
                                            ${isPendingRemoval ? "opacity-60 border-red-300 bg-red-50" : ""}
                                        `}
                                            >
                                                {/* REMOVE / UNDO — only for applicants that were
                                            actionable to begin with */}
                                                {!baseDisabled && (
                                                    <button
                                                        className={`
                                                    absolute top-2 right-2
                                                    ${isPendingRemoval
                                                                ? "text-red-500 hover:text-gray-500"
                                                                : "text-gray-400 hover:text-red-500"}
                                                `}
                                                        onClick={() => handleToggleRemove(applicant.id)}
                                                        title={isPendingRemoval ? "Undo removal" : "Remove from event"}
                                                    >
                                                        {isPendingRemoval ? <Undo2 size={16} /> : <X size={16} />}
                                                    </button>
                                                )}

                                                {/* UNSAVED / PENDING REMOVAL INDICATOR */}
                                                {isPendingRemoval ? (
                                                    <span className="absolute bottom-2 right-2 text-[10px] text-red-500">
                                                        Marked for removal
                                                    </span>
                                                ) : isModified && (
                                                    <span className="absolute bottom-2 right-2 text-[10px] text-orange-500">
                                                        Unsaved
                                                    </span>
                                                )}

                                                {/* HEADER */}
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold">
                                                        {applicant.firstName[0]}
                                                        {applicant.lastName[0]}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-sm">
                                                            {applicant.firstName} {applicant.lastName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {applicant.job?.jobTitle}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* STATUS */}
                                                <div className="text-xs">
                                                    {status === "Present" && (
                                                        <span className="text-emerald-600 flex items-center gap-1">
                                                            <CheckCircle size={14} /> Present
                                                        </span>
                                                    )}
                                                    {status === "Absent" && (
                                                        <span className="text-red-500 flex items-center gap-1">
                                                            <XCircle size={14} /> Absent
                                                        </span>
                                                    )}
                                                    {!status && (
                                                        <span className="text-gray-400">
                                                            Not marked
                                                        </span>
                                                    )}
                                                </div>

                                                {/* ACTIONS */}
                                                {isUpcoming ? (
                                                    <div className="flex flex-col items-center justify-center text-center py-3 px-4 border border-gray-300 rounded-lg bg-gray-50">
                                                        <p className="text-sm font-medium text-gray-600">
                                                            Attendance not yet available
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            You can mark attendance once the orientation starts.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            disabled={isDisabled || isUpcoming}
                                                            className="flex-1 btn rounded-lg disabled:brightness-75"
                                                            onClick={() =>
                                                                handleSubmit(applicant.id, "Present")
                                                            }
                                                        >
                                                            Present
                                                        </button>

                                                        <button
                                                            disabled={isDisabled || isUpcoming}
                                                            className="flex-1 btn rounded-lg disabled:brightness-75"

                                                            onClick={() =>
                                                                handleSubmit(applicant.id, "Absent")
                                                            }
                                                        >
                                                            Absent
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ModalBody>
                        <div className="flex justify-between gap-4 p-4 border-t border-gray-300">
                            <p className="text-sm text-gray-500">
                                {hasChanges ? "You have unsaved changes" : "All changes saved"}
                            </p>

                            <button
                                disabled={!hasChanges || isSaving}
                                className={`
                                        btn px-6 rounded-xl text-white
                                        ${hasChanges
                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                        : "bg-gray-300 cursor-not-allowed"}
                                    `}
                                onClick={handleSaveAll}
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        </ModalBackground>
    );
}