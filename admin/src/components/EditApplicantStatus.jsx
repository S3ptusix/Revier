/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { toast } from "react-toastify";
import Checkbox from "./ui/Checkbox";
import { useEffect } from "react";
import { useState } from "react";
import { moveApplicant } from "../services/applicants";

export default function EditApplicantStatus({
    applicantId,
    applicantStatus,
    onClose = () => { },
    loadPipeline = () => { }
}) {

    const [status, setStatus] = useState(applicantStatus);

    const handleSubmit = async () => {
        try {
            const { success, message } = await moveApplicant(applicantId, { applicantStatus: status });
            if (success) {
                loadPipeline();
                onClose();
                return
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="modal-style">
            <div className="space-y-4">
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Edit Applicant status</p>

                <Checkbox
                    name="status"
                    label="New"
                    checked={status === 'New'}
                    onChange={() => setStatus('New')}
                />

                <Checkbox
                    name="status"
                    label="Interview"
                    checked={status === 'Interview'}
                    onChange={() => setStatus('Interview')}
                />

                <Checkbox
                    name="status"
                    label="Orientation"
                    checked={status === 'Orientation'}
                    onChange={() => setStatus('Orientation')}
                />

                <Checkbox
                    name="status"
                    label="Hired"
                    checked={status === 'Hired'}
                    onChange={() => setStatus('Hired')}
                />

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
