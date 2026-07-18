import { useState } from "react";
import { toast } from "react-toastify";
import { RotateCcw } from "lucide-react";
import { retoreCompany } from "../services/companyServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";

export default function RestoreCompany({
    companyId,
    onClose = () => {},
    loadAfter = () => {}
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await retoreCompany(companyId);

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

                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        icon={RotateCcw}
                        title="Restore Company"
                        subTitle="Make this company active again"
                        onClose={onClose}
                    />
                </div>

                {/* BODY */}
                <div className="mb-6">
                    <div className="text-sm text-gray-600 bg-gray-50 border rounded-lg p-4">
                        Restoring this company will also restore its related jobs
                        and make them visible again in active listings.
                    </div>
                </div>

                {/* FOOTER */}
                <ModalFooter
                    cancelLabel="Cancel"
                    submitLabel={isSubmitting ? "Restoring..." : "Restore Company"}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />

            </Modal>
        </ModalBackground>
    );
}