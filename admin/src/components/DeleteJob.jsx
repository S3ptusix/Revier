import { toast } from "react-toastify";
import { deleteJob } from "../services/jobServices";
import { AlertTriangle } from "lucide-react";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";
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

                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <AlertTriangle className="text-red-600" size={32} />
                </div>

                {/* Content */}
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Delete Job
                    </h2>

                    <p className="mt-2 text-gray-600">
                        Are you sure you want to delete this job posting?
                    </p>

                    {/* Warning Box */}
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                        <p className="font-medium text-red-700">
                            This action will:
                        </p>

                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600">
                            <li>Archive the job posting.</li>
                            <li>Remove it from active listings.</li>
                            <li>Hide it from applicants and job seekers.</li>
                        </ul>

                        <p className="mt-3 text-xs text-red-500">
                            This may impact ongoing applications tied to this job.
                        </p>
                    </div>
                </div>

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
