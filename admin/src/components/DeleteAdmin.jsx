import { toast } from "react-toastify";
import { deleteAdmin } from "../services/adminServices";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";


export default function DeleteAdmin({ adminId, onClose = () => { }, loadAfter = () => { } }) {

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const { success, message } = await deleteAdmin(adminId);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBackground>
            <Modal>

                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="text-red-600" size={32} />
                </div>

                {/* Content */}
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Delete Administrator
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Are you sure you want to delete this administrator?
                    </p>

                    {/* Warning Box */}
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                        <p className="font-medium text-red-700">
                            This action will:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                            <li>Permanently remove the administrator account.</li>
                            <li>Revoke all system access immediately.</li>
                            <li>Cannot be undone.</li>
                        </ul>
                    </div>
                </div>

                <ModalFooter
                    submitLabel={isLoading ? "Deleting..." : "Delete Admin"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isLoading}
                    submitColor="RED"
                />
            </Modal>

        </ModalBackground>

    );
}
