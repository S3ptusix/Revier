import { toast } from "react-toastify";
import { useState } from "react";
import { Modal, ModalBackground, ModalBodyError, ModalFooter } from "./ui/ui-modal";
import { CircleX } from "lucide-react";
import Textarea from "./ui/Textarea";
import { useForm } from "../hooks/form";
import { failedInterview } from "../services/interviewServices";

const QUICK_REASONS = [
    "Lack of experience",
    "Did not meet required skills",
    "Poor communication",
    "Failed technical assessment",
];

export default function FailedInterview({
    applicantId,
    loadAfter = () => { },
    onClose = () => { },
}) {

    const [isLoading, setIsLoading] = useState(false);

    const { formData, handleInputChange } = useForm({
        rejectedReason: "",
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
                    
                    <div>
                        <p className="mb-2 text-xs font-medium text-gray-500">
                            Quick select a reason
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_REASONS.map((reason) => {
                                const isSelected = formData.rejectedReason === reason;
                                return (
                                    <button
                                        key={reason}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() =>
                                            handleInputChange({
                                                target: { name: "rejectedReason", value: reason }
                                            })
                                        }
                                        className={[
                                            "cursor-pointer px-3 py-1.5 text-xs font-medium rounded-full border",
                                            isSelected
                                                ? "border-gray-400 bg-gray-200 text-gray-600"
                                                : "border-gray-200 text-gray-600",
                                        ].join(" ")}
                                    >
                                        {reason}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                                
                    <Textarea
                        label="Reason for rejection"
                        name="rejectedReason"
                        value={formData.rejectedReason}
                        onChange={handleInputChange}
                        placeholder="e.g. Lack of experience, did not meet required skills..."
                    />
                </ModalBodyError>

                <ModalFooter
                    submitLabel={isLoading ? "Processing..." : "Mark as Failed"}
                    onSubmit={confirmFailedInterview}
                    onClose={onClose}
                    disableSubmit={isLoading}
                    submitColor="RED"
                />
            </Modal>
        </ModalBackground>
    )
}