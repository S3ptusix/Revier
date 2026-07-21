import { toast } from "react-toastify";
import { deleteCompany } from "../services/companyServices";
import { AlertTriangle } from "lucide-react";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";
import { useState } from "react";

export default function DeleteCompany({ companyId, onClose = () => { }, loadAfter = () => { } }) {

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const { success, message } = await deleteCompany(companyId);
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
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Delete Company
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Are you sure you want to delete this company?
                    </p>

                    {/* Warning Box */}
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left mb-4">
                        <p className="font-medium text-red-700">
                            This action will:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                            <li>Move the company to archive.</li>
                            <li>Archive all related job postings.</li>
                            <li>Hide the company from active listings.</li>
                        </ul>

                        <p className="mt-3 text-xs text-red-500">
                            This action may affect ongoing recruitment processes.
                        </p>
                    </div>
                </div>

                <ModalFooter
                    submitLabel={isLoading ? "Deleting..." : "Delete Company"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isLoading}
                    submitColor="RED"
                />
            </Modal>

        </ModalBackground>

    );
}
