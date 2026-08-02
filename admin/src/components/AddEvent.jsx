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
import { isWithinWorkingHours, minDateTime } from "../utils/tools";

export default function AddEvent({ onClose = () => { }, loadAfter = () => { } }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData, handleInputChange } = useForm({
        eventTitle: '',
        location: '',
        eventAt: '',
        note: ''
    });


    const handleSubmit = async () => {

        if (!isWithinWorkingHours(formData.eventAt)) {
            toast.error("Allowed time is 8:00 AM to 5:00 PM only");
            return;
        }

        try {


            setIsSubmitting(true);

            const { success, message } = await createOrientationEvent(formData);

            if (success) {
                toast.success(message || "Event created successfully");
                loadAfter();
                onClose();
            } else {
                toast.error(message || "Failed to create event");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
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
                            min={minDateTime}
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

                {/* FOOTER */}
                <ModalFooter
                    submitLabel={isSubmitting ? "Creating..." : "Create Event"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isSubmitting}
                />
            </Modal>
        </ModalBackground>
    );
}