import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import Textarea from "./ui/Textarea";
import { createOrientationEvent } from "../services/orientationsServices";

export default function AddEvent({ onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, handleInputChange } = useForm({
        eventTitle: '',
        location: '',
        eventAt: '',
        note: ''
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await createOrientationEvent(formData);
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
                <p className="text-lg font-semibold">Create Orientation Event</p>
                <p className="text-sm text-gray-500 mb-8">
                    Schedule a new orientation event
                </p>

                <div className="mb-4">
                    <Input
                        label="Event Title"
                        required={true}
                        name="eventTitle"
                        placeholder="e.g., New Hire Orientation - February"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Location"
                        name="location"
                        placeholder="e.g., Main Conference Room"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Date"
                        type="datetime-local"
                        name="eventAt"
                        value={formData.eventAt}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-8">
                    <Textarea
                        label="Notes"
                        name="note"
                        placeholder="Additional notes or instructions..."
                        value={formData.note}
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
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    );
}
