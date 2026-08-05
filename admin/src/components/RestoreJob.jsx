import { useState } from "react";
import { toast } from "react-toastify";
import { restoreJob } from "../services/jobServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "./ui/ui-modal";

export default function RestoreJob({
    jobId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            const { success, message } = await restoreJob(jobId);

            if (success) {
                toast.success(message);
                loadAfter();
                onClose();
                return;
            }

            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={450}>

                <ModalHeader
                    title="Restore Job"
                    subTitle="Bring this job back to active listings"
                    onClose={onClose}
                />

                <ModalBody>
                    <p className="text-sm">
                        This will restore the job and make it visible again to applicants.
                    </p>
                </ModalBody>

                <ModalFooter
                    cancelLabel="Cancel"
                    submitLabel={isLoading ? "Restoring..." : "Restore Job"}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                    disableSubmit={isLoading}
                />

            </Modal>
        </ModalBackground>
    );
}