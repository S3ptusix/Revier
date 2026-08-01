import { toast } from "react-toastify";
import { useState } from "react";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";
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
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <CircleX className="text-red-600" size={32} />
                </div>

                {/* Content */}
                <div className="text-center mt-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Mark Applicant as Failed
                    </h2>

                    <p className="mt-1.5 text-sm text-gray-500">
                        This will move the applicant out of the interview pipeline.
                    </p>

                    {/* Warning Box */}
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3.5 text-left">
                        <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
                            This action will
                        </p>

                        <ul className="mt-2 space-y-1.5 text-sm text-red-700">
                            {[
                                "Move the applicant to rejected status",
                                "Remove them from the interview pipeline",
                                "Prevent further progression in hiring",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Quick reasons */}
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

                <div className="mb-8">
                    <Textarea
                        label="Reason for rejection"
                        name="rejectedReason"
                        value={formData.rejectedReason}
                        onChange={handleInputChange}
                        placeholder="e.g. Lack of experience, did not meet required skills..."
                        className="mt-3"
                    />
                </div>

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