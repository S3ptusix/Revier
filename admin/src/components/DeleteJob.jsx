import { toast } from "react-toastify";
import { deleteJob } from "../services/jobServices";
import { Modal, ModalBackground, ModalBodyError, ModalFooter } from "./ui/ui-modal";
import { useState } from "react";

export default function DeleteJob({ jobId, onClose = () => { }, loadAfter = () => { } }) {

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const { success, message } = await deleteJob(jobId);
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
                    title="Delete Job"
                    subTitle="Are you sure you want to delete this job posting?"
                    effectList={[
                        "Archive the job posting.",
                        "Remove it from active listings.",
                        "Hide it from applicants and job seekers.",
                        "This may impact ongoing applications tied to this job."
                    ]}
                />

                <ModalFooter
                    submitLabel={isLoading ? "Deleting..." : "Delete Job"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isLoading}
                    submitColor="RED"
                />
            </Modal>

        </ModalBackground>

    );
}
