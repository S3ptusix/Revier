import { X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteOrientation } from "../services/orientationsServices";

export default function DeleteOrientationEvent({
    orientationId,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await deleteOrientation(orientationId);
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
                <p className="text-lg font-semibold mb-8">Delete Orientation Event</p>

                <p className="mb-8 text-center text-red-500 bg-red-500/10 p-4 rounded-xl">Are you sure you want to delete this OrientationEvent?</p>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Delete Orientation Event
                    </button>
                </div>
            </div>
        </div>
    );
}
