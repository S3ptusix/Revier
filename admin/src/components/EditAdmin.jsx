/* eslint-disable react-hooks/exhaustive-deps */
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin } from "../services/adminServices";
import { toast } from "react-toastify";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";

// ✅ import your modal components
import { Modal, ModalBackground, ModalHeader, ModalFooter } from "./ui/ui-modal";

export default function EditAdmin({ adminId, onClose = () => { }, loadAfter = () => { } }) {

    const [formData, setFormData] = useState({ role: '' });

    const [showConfirm, setShowConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const { success, message } = await editAdmin(adminId, formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            toast.error(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const { success, message, admin } = await fetchOneAdmin(adminId);
            if (success) return setFormData(admin);
            toast.error(message);
        };

        loadData();
    }, []);

    return (
        <>
            {/* 🔹 Main Modal */}
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Edit Administrator"
                        subTitle="This will update the administrator role."
                        onClose={onClose}
                    />

                    <p className="input-label mt-8 mb-1">
                        Role <span className="text-red-500">*</span>
                    </p>

                    <div className="grid grid-cols-2 mb-8">
                        <InputCheck
                            type="radio"
                            name="role"
                            label="HR Manager"
                            value="HR Manager"
                            checked={formData.role === 'HR Manager'}
                            onChange={handleInputChange}
                        />
                        <InputCheck
                            type="radio"
                            name="role"
                            label="HR Associate"
                            value="HR Associate"
                            checked={formData.role === 'HR Associate'}
                            onChange={handleInputChange}
                        />
                    </div>

                    <ModalFooter
                        submitLabel="Save Changes"
                        onSubmit={() => setShowConfirm(true)}
                        onClose={onClose}
                    />
                </Modal>
            </ModalBackground>

            {/* 🔹 Confirm Modal */}
            {showConfirm && (
                <ModalBackground>
                    <Modal maxWidth={420}>
                        {/* Icon */}
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                            <AlertTriangle
                                className="text-amber-600"
                                size={32}
                            />
                        </div>

                        {/* Content */}
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Update Administrator Role
                            </h2>

                            <p className="mt-2 text-gray-600">
                                Are you sure you want to save these changes?
                            </p>

                            {/* Warning Box */}
                            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
                                <p className="font-medium text-amber-700">
                                    This action may:
                                </p>

                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-600">
                                    <li>Change the administrator’s access level.</li>
                                    <li>Modify what features they can view or manage.</li>
                                    <li>Affect permissions across the system.</li>
                                </ul>
                            </div>
                        </div>

                        <ModalFooter
                            submitLabel={isLoading ? "Saving..." : "Confirm Changes"}
                            onSubmit={handleSubmit}
                            onClose={onClose}
                            disableSubmit={isLoading}
                        />
                    </Modal>

                </ModalBackground>


            )}
        </>
    );


}
