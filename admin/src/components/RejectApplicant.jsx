import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { isRejected } from "../services/applicants";

export default function RejectApplicant({
    applicantId,
    onClose = () => {},
    loadAfter = () => {},
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
        <div className="modal-style">
            <div className="space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle
                        className="text-red-600"
                        size={32}
                    />
                </div>

                <div className="text-center">
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

                <div className="flex justify-end gap-3">
                    <button
                        className="btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Rejecting..." : "Reject Applicant"}
                    </button>
                </div>
            </div>
        </div>
    );
}