import { X } from "lucide-react";
import { toast } from "react-toastify";
import { interviewResult } from "../services/applicants";

export default function InterviewResult({ applicantId, onClose = () => { }, loadAfter = () => { } }) {

    const handleSubmit = async (interviewStatus) => {
        try {
            const { success, message } = await interviewResult(applicantId, { interviewStatus });
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Update Interview Result</p>
                <p className="text-sm text-gray-500 mb-8">
                    Mark interview result
                </p>

                <div className="grid gap-4">
                    <button
                        className="bg-emerald-500 text-white p-4 rounded-lg"
                        onClick={() => handleSubmit('Passed')}
                    >
                        <p className="font-semibold">Passed Interview</p>
                        <p className="text-sm">Mark to Orientation state</p>
                    </button>
                    <button
                        className="bg-red-500 text-white p-4 rounded-lg"
                        onClick={() => handleSubmit('Failed')}
                    >
                        <p className="font-semibold">Failed Interview</p>
                        <p className="text-sm">Mark as unseccessfull</p>
                    </button>
                </div>
            </div>
        </div>
    );
}
