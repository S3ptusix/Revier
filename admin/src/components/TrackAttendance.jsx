/* eslint-disable react-hooks/exhaustive-deps */
import { X, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    applicantsFromOrientation,
    editOrientationStatus,
    removeFromEvent
} from "../services/orientationsServices";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
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

    // 💾 SAVE ALL
    const handleSaveAll = async () => {
        try {
            setIsSaving(true);

            const updates = Object.entries(modified);

            for (const [applicantId, orientationStatus] of updates) {
                await editOrientationStatus(applicantId, { orientationStatus });
            }

            toast.success("Attendance saved");

            setModified({});
            loadAfter();
            loadOrientations();

        } catch (error) {
            console.error(error);
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRemoveFromEvent = async (applicantId) => {
        try {
            setApplicants(prev =>
                prev.filter(a => a.id !== applicantId)
            );

            const { success, message } = await removeFromEvent(applicantId);

            if (!success) console.error(message);
            else loadAfter();

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadOrientations();
    }, []);

    const hasChanges = Object.keys(modified).length > 0;

    return (
        <ModalBackground>
            <Modal maxWidth={900}>
                <div className="mb-6">
                    <ModalHeader
                        title="Track Attendance"
                        subTitle="Mark attendance then save changes"
                        onClose={onClose}
                    />
                </div>

                {/* LOADING */}
                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loading />
                    </div>
                ) : applicants.length === 0 ? (
                    <NoData message="No applicants in this event" />
                ) : (
                    <>
                        {/* GRID */}
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">

                            {applicants.map(applicant => {
                                
                                const isDisabled =
                                    applicant.applicantStatus === "Hired" ||
                                    applicant.orientationStatus !== null ||
                                    applicant.isRejected === true;

                                const status = applicant.orientationStatus;

                                const isModified = modified[applicant.id];

                                return (
                                    <div
                                        key={applicant.id}
                                        className={`
                                            relative border border-gray-300 rounded-xl p-3 flex flex-col gap-3
                                            transition hover:shadow-sm
                                            ${isDisabled ? "brightness-75 bg-gray-50 pointer-events-none" : ""}
                                        `}
                                    >
                                        {/* REMOVE */}
                                        {!isDisabled && (
                                            <button
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                                onClick={() => handleRemoveFromEvent(applicant.id)}
                                            >
                                                <X size={16} />
                                            </button>
                                        )}

                                        {/* UNSAVED INDICATOR */}
                                        {isModified && (
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
                                        <div className="flex gap-2">
                                            <button
                                                disabled={isDisabled}
                                                className={`
                                                    flex-1 btn rounded-lg
                                                    ${status === "Present"
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}
                                                `}
                                                onClick={() =>
                                                    handleSubmit(applicant.id, "Present")
                                                }
                                            >
                                                Present
                                            </button>

                                            <button
                                                disabled={isDisabled}
                                                className={`
                                                    flex-1 btn rounded-lg
                                                    ${status === "Absent"
                                                        ? "bg-red-600 text-white"
                                                        : "bg-red-100 text-red-600 hover:bg-red-200"}
                                                `}
                                                onClick={() =>
                                                    handleSubmit(applicant.id, "Absent")
                                                }
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* 🔥 STICKY SAVE BAR */}
                        <div className="sticky bottom-0 bg-white border-t mt-6 pt-3 flex justify-between items-center">
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