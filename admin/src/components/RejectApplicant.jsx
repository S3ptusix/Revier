import { toast } from "react-toastify";
import { isRejected } from "../services/applicants";

export default function RejectApplicant({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await isRejected(applicantId);
            if (success) {
                loadAfter();
                onClose();
                return
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-style">
            <div>
                <p className="mb-8 text-center text-red-500 bg-red-500/10 p-4 rounded-xl">Are you sure you want to reject this Applicant?</p>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Reject Applicant
                    </button>
                </div>
            </div>
        </div>
    );
}
