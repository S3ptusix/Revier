import { toast } from "react-toastify";
import { retoreCompany } from "../services/companyServices";

export default function RestoreCompany({ companyId, onClose = () => { }, loadAfter = () => { } }) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await retoreCompany(companyId);
            if (success) {
                toast.success(message);
                onClose();
                loadAfter();
                return;
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="modal-style">
            <div>
                <p className="mb-8 text-center text-gray-500 bg-gray-500/10 p-4 rounded-xl">
                    This will restore the company and its related jobs, making them visible again in active listings.
                </p>
                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white"
                        onClick={handleSubmit}
                    >
                        Restore Company
                    </button>
                </div>
            </div>
        </div>
    );
}
