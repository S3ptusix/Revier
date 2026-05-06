import { toast } from "react-toastify";
import { deleteCompany } from "../services/companyServices";

export default function DeleteCompany({ companyId, onClose = () => { }, loadAfter = () => { } }) {

    const handleSubmit = async () => {
        try {
            const { success, message } = await deleteCompany(companyId);
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
                    Deleting this company will move it and all related jobs to the archive. Proceed carefully.
                </p>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Delete Company
                    </button>
                </div>
            </div>
        </div>
    );
}
