/* eslint-disable react-hooks/exhaustive-deps */
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin } from "../services/adminServices";
import { toast } from "react-toastify";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";

// ✅ import your modal components
import { Modal, ModalBackground, ModalHeader, ModalFooter, ModalBody, InfoList } from "./ui/ui-modal";

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

                    <ModalBody>
                        <div className="grid grid-cols-2">
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
                    </ModalBody>


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
                    <Modal>
                        <ModalHeader
                            title="Update Administrator Role"
                            subTitle="Are you sure you want to save these changes?"
                        />

                        <ModalBody>
                            <InfoList
                                infoList={[
                                    "Change the administrator’s access level.",
                                    "Modify what features they can view or manage.",
                                    "Affect permissions across the system.",
                                ]}
                            />
                        </ModalBody>


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
