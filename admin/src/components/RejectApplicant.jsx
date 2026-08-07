import { useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBackground, ModalBody, ModalBodyError, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useForm } from "../hooks/form";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import { reject } from "../services/newServices";
import ItemSelector from "./ui/ItemSelector";

export default function RejectApplicant({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
}) {

    const REJECT_REASONS = [
        { item: 'Not Qualified', value: 'The candidate does not meet the required qualifications for this role.' },
        { item: 'Incomplete Requirements', value: 'The candidate failed to submit all required documents or requirements.' },
        { item: 'Candidate Withdrew', value: 'The candidate has voluntarily withdrawn their application.' },
        { item: 'Position Closed', value: 'The position has already been filled or is no longer available.' },
        { item: 'Others', value: '' }
    ];

    const [loading, setLoading] = useState(false);

    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        rejectedReason: "",
        rejectedReasonNote: ""
    });

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

                        <ItemSelector
                            items={REJECT_REASONS}
                            itemSelected={formData.rejectedReason}
                            onChange={(item) =>
                                setFormData(prev => ({
                                    ...prev,
                                    rejectedReason: item.item,
                                    rejectedReasonNote: item.value,
                                }))
                            }
                        />

                        <Textarea
                            label="Reason for rejection"
                            name="rejectedReasonNote"
                            value={formData.rejectedReasonNote}
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
                        disableSubmit={!formData.rejectedReason.trim() || !formData.rejectedReasonNote.trim()}
                    />
                </Modal>
            </ModalBackground>

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
                                        Feedback: <span className="whitespace-pre-wrap">{formData.rejectedReasonNote}</span>
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