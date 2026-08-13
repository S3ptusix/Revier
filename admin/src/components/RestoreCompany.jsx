import { useState } from "react";
import { toast } from "react-toastify";
import { restoreCompany } from "../services/companyServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "./ui/ui-modal";

export default function RestoreCompany({
    companyId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await restoreCompany(companyId);

            if (success) {
                toast.success(message);
                onClose();
                loadAfter();
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={420}>

                <ModalHeader
                    title="Restore Company"
                    subTitle="Make this company active again"
                    onClose={onClose}
                />

                <ModalBody>
                    <p className="text-sm">
                        Restoring this company will also restore its related jobs
                        and make them visible again in active listings.
                    </p>
                </ModalBody>

                <ModalFooter
                    cancelLabel="Cancel"
                    submitLabel={isSubmitting ? "Restoring..." : "Restore Company"}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                    disableSubmit={isSubmitting}
                />

            </Modal>
        </ModalBackground>
    );
}