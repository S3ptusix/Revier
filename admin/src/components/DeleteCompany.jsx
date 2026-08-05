import { toast } from "react-toastify";
import { deleteCompany } from "../services/companyServices";
import { Modal, ModalBackground, ModalBodyError, ModalFooter } from "./ui/ui-modal";
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

                <ModalBodyError
                    title="Delete Company"
                    subTitle="Are you sure you want to delete this company?"
                    effectList={[
                        "Move the company to archive.",
                        "Archive all related job postings.",
                        "Hide the company from active listings.",
                        "This action may affect ongoing recruitment processes."
                    ]}
                />

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
