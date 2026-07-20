/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import Textarea from "./ui/Textarea";
import { createOrientationEvent, editOrientationEvent, fetchOneOrientationEvent } from "../services/orientationsServices";
import { useEffect } from "react";
import { formatDateTimeLocal } from "../utils/format";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";

export default function EditEvent({ orientationId, onClose = () => { }, loadAfter = () => { } }) {

    const [isSubmiting, setIsSubmiting] = useState(false);
    const { formData, setFormData, handleInputChange } = useForm({
        eventTitle: '',
        location: '',
        eventAt: '',
        note: ''
    });

    const handleSubmit = async () => {
        try {
            setIsSubmiting(true);
            const { success, message } = await editOrientationEvent(orientationId, formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmiting(false);
        }
    };

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, orientation } = await fetchOneOrientationEvent(orientationId);
                if (success) {
                    const data = orientation;
                    setFormData({
                        ...data,
                        eventAt: formatDateTimeLocal(data.eventAt)
                    });
                    return;
                };
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [orientationId])

    return (
        <ModalBackground>
            <Modal>
                <div className="mb-8">
                    <ModalHeader
                        title="Edit Orientation Event"
                        onClose={onClose}
                    />
                </div>

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
                        required={true}
                        name="location"
                        placeholder="e.g., Main Conference Room"
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Date"
                        required={true}
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
                <ModalFooter
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    submitLabel={isSubmiting ? 'Saving...' : 'Save'}
                />
            </Modal>
        </ModalBackground>
    );
}
