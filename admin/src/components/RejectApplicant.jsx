import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { isRejected } from "../services/applicants";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";

export default function RejectApplicant({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const { success, message } = await isRejected(applicantId);

            if (success) {
                toast.success(message, {
                    toastId: "reject-success",
                });

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
        <ModalBackground>
            <Modal>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle
                        className="text-red-600"
                        size={32}
                    />
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Reject Applicant
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Are you sure you want to reject this applicant?
                    </p>

                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                        <p className="font-medium text-red-700">
                            This action will:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                            <li>Mark the applicant as rejected.</li>
                            <li>Remove them from the active recruitment pipeline.</li>
                            <li>Notify the applicant of the decision.</li>
                        </ul>
                    </div>
                </div>

                <ModalFooter
                    submitLabel={loading ? "Rejecting..." : "Reject Applicant"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={loading}
                    submitColor="RED"
                />
            </Modal>
        </ModalBackground>
    );
}