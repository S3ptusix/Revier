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
    loadTable = () => { }
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
                loadTable();
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
                <p className="text-lg font-semibold">Schedule Interview</p>
                <p className="text-sm text-gray-500 mb-8">
                    Schedule interview
                </p>

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
                        required={true}
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
                        required={true}
                        name="interviewLocation"
                        value={formData.interviewLocation}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Textarea
                        label="Notes"
                        required={true}
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
