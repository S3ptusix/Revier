import { useState } from "react";
import { toast } from "react-toastify";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import Textarea from "./ui/Textarea";
import { useForm } from "../hooks/form";
import { createOrientationEvent } from "../services/orientationsServices";
import { CalendarDays, MapPin } from "lucide-react";

export default function AddEvent({ onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData, handleInputChange } = useForm({
        eventTitle: '',
        location: '',
        eventAt: '',
        note: ''
    });

    // ✅ VALIDATION
    const validate = () => {
        if (!formData.eventTitle.trim()) return "Event title is required";
        if (!formData.location.trim()) return "Location is required";
        if (!formData.eventAt) return "Date & time is required";
        return "";
    };

    const handleSubmit = async () => {
        const error = validate();
        if (error) {
            setErrorMessage(error);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMessage('');

            const { success, message } = await createOrientationEvent(formData);

            if (success) {
                toast.success(message || "Event created successfully");
                loadAfter();
                onClose();
            } else {
                setErrorMessage(message || "Failed to create event");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={600}>

                {/* HEADER */}
                <ModalHeader
                    title="Create Orientation Event"
                    onClose={onClose}
                />

                {/* SUBTEXT */}
                <p className="text-sm text-gray-500 mb-6">
                    Schedule and manage onboarding sessions
                </p>

                {/* FORM */}
                <div className="space-y-4 mb-6">

                    {/* TITLE */}
                    <Input
                        label="Event Title"
                        required
                        name="eventTitle"
                        placeholder="e.g., New Hire Orientation - February"
                        value={formData.eventTitle}
                        onChange={handleInputChange}
                    />

                    {/* LOCATION */}
                    <Input
                        label="Location"
                        required
                        name="location"
                        placeholder="e.g., Main Conference Room or Zoom"
                        value={formData.location}
                        onChange={handleInputChange}
                    />

                    {/* DATE */}
                    <div>
                        <Input
                            label="Date & Time"
                            required
                            type="datetime-local"
                            name="eventAt"
                            value={formData.eventAt}
                            onChange={handleInputChange}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Used for scheduling and reminders
                        </p>
                    </div>

                    {/* NOTES */}
                    <Textarea
                        label="Notes (optional)"
                        name="note"
                        placeholder="Add agenda, instructions, or reminders..."
                        value={formData.note}
                        onChange={handleInputChange}
                    />
                </div>

                {/* ERROR */}
                {errorMessage && (
                    <div className="mb-6">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                )}

                {/* FOOTER */}
                <ModalFooter
                    submitLabel={isSubmitting ? "Creating..." : "Create Event"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disabled={isSubmitting}
                />
            </Modal>
        </ModalBackground>
    );
}