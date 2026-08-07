import { toast } from "react-toastify";
import { useState } from "react";
import { Modal, ModalBackground, ModalBodyError, ModalFooter } from "./ui/ui-modal";
import { CircleX } from "lucide-react";
import Textarea from "./ui/Textarea";
import { useForm } from "../hooks/form";
import { failedInterview } from "../services/interviewServices";
import ItemSelector from "./ui/ItemSelector";

export default function FailedInterview({
    applicantId,
    loadAfter = () => { },
    onClose = () => { },
}) {

    const REJECT_REASONS = [
        { item: 'No Show', value: 'The candidate did not attend the scheduled interview without prior notice.' },
        { item: 'Failed Interview', value: 'The candidate did not meet the required performance or expectations during the interview.' },
        { item: 'Not Qualified', value: 'The candidate does not meet the required qualifications for this role.' },
        { item: 'Incomplete Requirements', value: 'The candidate failed to submit all required documents or requirements.' },
        { item: 'Candidate Withdrew', value: 'The candidate has voluntarily withdrawn their application.' },
        { item: 'Position Closed', value: 'The position has already been filled or is no longer available.' },
        { item: 'Others', value: '' }
    ];


    const [isLoading, setIsLoading] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        rejectedReason: "",
        rejectedReasonNote: "",
    });

    const confirmFailedInterview = async () => {
        try {
            setIsLoading(true);
            const { success, message } = await failedInterview(applicantId, formData);

            if (success) {
                loadAfter();
                onClose();
                toast.success(message);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBackground>
            <Modal>

                <ModalBodyError
                    icon={CircleX}
                    title="Mark Applicant as Failed"
                    subTitle="This will move the applicant out of the interview pipeline."
                    effectList={[
                        "Move the applicant to rejected status",
                        "Remove them from the interview pipeline",
                        "Prevent further progression in hiring",
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
                        placeholder="e.g. Lack of experience, did not meet required skills..."
                    />
                </ModalBodyError>

                <ModalFooter
                    submitLabel={isLoading ? "Processing..." : "Mark as Failed"}
                    onSubmit={confirmFailedInterview}
                    onClose={onClose}
                    disableSubmit={isLoading || !formData.rejectedReason.trim() || !formData.rejectedReasonNote.trim()}
                    submitColor="RED"
                />
            </Modal>
        </ModalBackground>
    )
}