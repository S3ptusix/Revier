import { X } from "lucide-react";
import { toast } from "react-toastify";
import { deleteAdmin } from "../services/adminServices";

export default function DeleteAdmin({ adminId, onClose = () => { }, loadTable = () => { } }) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await deleteAdmin(adminId);
            if (success) {
                loadTable();
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
                <p className="text-lg font-semibold mb-8">Delete Admin</p>

                <p className="mb-8 text-center text-red-500 bg-red-500/10 p-4 rounded-xl">Are you sure you want to delete this Admin?</p>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Delete Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
