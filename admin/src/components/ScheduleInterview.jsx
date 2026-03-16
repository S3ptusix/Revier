/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import { scheduleInterview } from "../services/applicants";
import Textarea from "./ui/Textarea";

export default function ScheduleInteview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [ errorMessage, setErrorMessage ] = useState('');
    const { formData, setFormData, handleInputChange } = useForm({
        interviewAt: '',
        interviewMode: '',
        interviewLocation: '',
        interviewNotes: '',
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await scheduleInterview(applicantId, formData);
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


    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Schedule Interview</p>
                <div className="mb-4">
                    <Input
                        label="Interview Date-Time"
                        required={true}
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
                        Schedule Interview
                    </button>
                </div>
            </div>
        </div>
    );
}
