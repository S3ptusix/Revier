import { X } from "lucide-react";
import { toast } from "react-toastify";
import { moveApplicant } from "../services/applicants";

export default function EditApplicantStatus({
    applicantId,
    applicantStatus,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const handleSubmit = async (applicantStatus) => {
        try {
            const { success, message } = await moveApplicant(applicantId, { applicantStatus });
            if (success) {
                loadAfter();
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

                <div className="grid grid-cols-2 gap-4">

                    <button
                        disabled={applicantStatus === 'New'}
                        className="p-4 flex-col bg-gray-100 rounded-xl cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:brightness-75"
                        onClick={
                            () => handleSubmit(
                                applicantStatus === 'Interview' ? 'New' :
                                    applicantStatus === 'Orientation' ? 'Interview' :
                                        applicantStatus === 'Hired' ? 'Orientation' :
                                            ''
                            )
                        }
                    >
                        <p className="font-semibold">Move Back</p>
                        <p className="font-normal text-sm">
                            {
                                applicantStatus === 'Interview' ? 'to New' :
                                    applicantStatus === 'Orientation' ? 'to Interview' :
                                        applicantStatus === 'Hired' ? 'to Orientation' :
                                            ''
                            }
                        </p>
                    </button>

                    <button
                        disabled={applicantStatus === 'Hired'}
                        className="p-4 flex-col bg-emerald-500 text-white rounded-xl cursor-pointer disabled:pointer-events-none disabled:opacity-50 disabled:brightness-75"
                        onClick={
                            () => handleSubmit(
                                applicantStatus === 'New' ? 'Interview' :
                                    applicantStatus === 'Interview' ? 'Orientation' :
                                        applicantStatus === 'Orientation' ? 'Hired' :
                                            ''
                            )
                        }
                    >
                        <p className="font-semibold">Move Up</p>
                        <p className="font-normal text-sm">
                            {
                                applicantStatus === 'New' ? 'to Interview' :
                                    applicantStatus === 'Interview' ? 'to Orientation' :
                                        applicantStatus === 'Orientation' ? 'to Hired' :
                                            ''
                            }
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
