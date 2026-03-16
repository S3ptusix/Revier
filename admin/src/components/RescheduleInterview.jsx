/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import { fetchOneInterview, rescheduleInterview, scheduleInterview } from "../services/applicants";
import Textarea from "./ui/Textarea";
import { formatDateTimeLocal } from "../utils/format";

export default function RescheduleInteview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const { formData, setFormData, handleInputChange } = useForm({
        interviewAt: '',
        interviewMode: '',
        interviewLocation: '',
        interviewNotes: '',
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await rescheduleInterview(applicantId, formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, applicant } = await fetchOneInterview(applicantId);
                if (success) return setFormData({
                    ...applicant, 
                    interviewAt: formatDateTimeLocal(applicant.interviewAt)
                });
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [])

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Reschedule Interview</p>

                <div className="mb-4">
                    <Input
                        label="Interview Date-Time"
                        name="interviewAt"
                        type="datetime-local"
                        value={formData.interviewAt}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Interview Mode"
                        name="interviewMode"
                        placeholder="Select Mode"
                        value={formData.interviewMode}
                        options={[
                            { value: 'In-Person', name: 'In-Person' },
                            { value: 'Virtual (Video Call)', name: 'Virtual (Video Call)' },
                            { value: 'Phone Call', name: 'Phone Call' },
                        ]}
                        onChange={handleInputChange}

                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Location/Link"
                        name="interviewLocation"
                        value={formData.interviewLocation}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Textarea
                        label="Notes"
                        name="interviewNotes"
                        value={formData.interviewNotes}
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-8">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white"
                        onClick={handleSubmit}
                    >
                        Reschedule Interview
                    </button>
                </div>
            </div>
        </div>
    );
}
