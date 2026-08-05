import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBackground, ModalBody, ModalBodyError, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useForm } from "../hooks/form";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import { reject } from "../services/newServices";

export default function RejectApplicant({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
}) {
    const [loading, setLoading] = useState(false);

    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // 🔥 Builder modal
    const [showBuilderModal, setShowBuilderModal] = useState(false);

    // 🔥 Builder state
    const [reasonBuilder, setReasonBuilder] = useState({
        reasonType: "",
        detail: ""
    });

    const { formData, setFormData, handleInputChange } = useForm({
        rejectedReason: ""
    });

    // 🔥 Generate rejection reason
    const generateReason = () => {
        const notes = [];

        if (reasonBuilder.reasonType) {
            notes.push(reasonBuilder.reasonType);
        }

        if (reasonBuilder.detail) {
            notes.push(reasonBuilder.detail);
        }

        if (notes.length === 0) {
            notes.push("The applicant did not meet the required standards for this position.");
        }

        const finalMessage = notes.join("\n");

        setFormData((prev) => ({
            ...prev,
            rejectedReason: finalMessage
        }));

        setShowBuilderModal(false);

    };


    const handleSubmit = async () => {
        if (!formData.rejectedReason.trim()) {
            toast.error("Please provide a rejection reason.");
            return;
        }

        setLoading(true);

        try {
            const { success, message } = await reject(
                applicantId,
                formData
            );

            if (success) {
                toast.success(message, { toastId: "reject-success" });
                loadAfter();
                onClose();
                return;
            }

            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🔥 MAIN MODAL */}
            <ModalBackground>
                <Modal>

                    <ModalBodyError
                        title="Reject Applicant"
                        subTitle="Are you sure you want to reject this applicant?"
                        effectList={[
                            "Mark the applicant as rejected.",
                            "Remove them from the active recruitment pipeline.",
                            "Notify the applicant of the decision.",
                        ]}
                    >
                        {/* 🔥 OPEN BUILDER */}
                        <button
                            type="button"
                            onClick={() => setShowBuilderModal(true)}
                            className="text-sm text-emerald-600 hover:underline mb-3"
                        >
                            + Build Rejection Reason
                        </button>

                        <Textarea
                            label="Reason for rejection"
                            name="rejectedReason"
                            value={formData.rejectedReason}
                            onChange={handleInputChange}
                            placeholder="Add or generate a rejection reason..."
                        />
                    </ModalBodyError>

                    <ModalFooter
                        submitLabel="Preview"
                        onSubmit={() => {
                            if (!formData.rejectedReason.trim()) {
                                return toast.error("Please provide a rejection reason.");
                            }
                            setShowPreviewModal(true);
                        }}
                        onClose={onClose}
                        disableSubmit={!formData.rejectedReason.trim()}
                    />
                </Modal>
            </ModalBackground>

            {/* 🔥 BUILDER MODAL */}
            {showBuilderModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Build Rejection Reason"
                            subTitle="Generate a clear and professional rejection reason"
                            onClose={() => setShowBuilderModal(false)}
                        />

                        <ModalBody>

                            <Select
                                label="Primary Reason"
                                placeholder="--"
                                value={reasonBuilder.reasonType}
                                onChange={(e) =>
                                    setReasonBuilder((prev) => ({
                                        ...prev,
                                        reasonType: e.target.value
                                    }))
                                }
                                options={[
                                    { value: "We regret to inform you that your qualifications did not fully match the requirements for this position.", name: "Skills mismatch" },
                                    { value: "We regret to inform you that we have decided to move forward with other candidates.", name: "Other candidates selected" },
                                    { value: "We regret to inform you that the position has already been filled.", name: "Position filled" }
                                ]}
                            />

                            <Select
                                label="Additional Detail"
                                placeholder="--"
                                value={reasonBuilder.detail}
                                onChange={(e) =>
                                    setReasonBuilder((prev) => ({
                                        ...prev,
                                        detail: e.target.value
                                    }))
                                }
                                options={[
                                    { value: "We were looking for candidates with more relevant experience.", name: "Experience gap" },
                                    { value: "Your submitted documents did not meet the requirements.", name: "Invalid documents" },
                                ]}
                            />

                        </ModalBody>
                        <ModalFooter
                            submitLabel="Generate Message"
                            onSubmit={generateReason}
                            onClose={() => setShowBuilderModal(false)}
                        />

                    </Modal>
                </ModalBackground>
            )}

            {showPreviewModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Preview Rejection Notification"
                            subTitle="Review the details before confirming"
                            onClose={() => setShowPreviewModal(false)}
                        />

                        <ModalBody>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Rejection Message (auto-generated)
                                </p>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm text-gray-800">

                                    <p>
                                        After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.
                                    </p>

                                    <p>
                                        Feedback: <span className="whitespace-pre-wrap">{formData.rejectedReason}</span>
                                    </p>

                                    <p>
                                        You may apply again after 30 days
                                    </p>

                                    <p>
                                        We appreciate your time and interest, and we encourage you to apply again in the future.
                                    </p>

                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                Need to make changes? Close this preview to edit the form.
                            </p>
                        </ModalBody>

                        <ModalFooter
                            submitLabel={loading ? "Rejecting..." : "Confirm & Send"}
                            onSubmit={handleSubmit}
                            onClose={() => setShowPreviewModal(false)}
                            disableSubmit={loading}
                            submitColor="RED"
                        />
                    </Modal>
                </ModalBackground>
            )}

        </>
    );
}