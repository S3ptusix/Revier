import { toast } from "react-toastify";
import { deleteJob } from "../services/jobServices";

export default function DeleteJob({ jobId, onClose = () => { }, loadAfter = () => { } }) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await deleteJob(jobId);
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
                <p className="mb-8 text-center text-red-500 bg-red-500/10 p-4 rounded-xl">
                    Warning: This job will be archived and removed from active listings.
                </p>
                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Delete Job
                    </button>
                </div>
            </div>
        </div>
    );
}
