import { toast } from "react-toastify";
import { deleteAdmin } from "../services/adminServices";
import { useState } from "react";
import { Modal, ModalBackground, ModalBodyError, ModalFooter } from "./ui/ui-modal";


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

                <ModalBodyError
                    title="Delete Administrator"
                    subTitle="Are you sure you want to delete this administrator?"
                    effectList={[
                        "Permanently remove the administrator account.",
                        "Revoke all system access immediately.",
                        "Cannot be undone.",
                    ]}
                />

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
