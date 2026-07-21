import { useState } from "react";
import { toast } from "react-toastify";
import { restoreJob } from "../services/jobServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";
import { RotateCcw } from "lucide-react";

export default function RestoreJob({
    jobId,
    onClose = () => {},
    loadAfter = () => {}
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
                
                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        icon={RotateCcw}
                        title="Restore Job"
                        subTitle="Bring this job back to active listings"
                        onClose={onClose}
                    />
                </div>

                {/* CONTENT */}
                <div className="mb-8">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm">
                        This will restore the job and make it visible again to applicants.
                    </div>
                </div>

                {/* FOOTER */}
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