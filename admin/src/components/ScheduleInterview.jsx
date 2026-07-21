/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import { scheduleInterview } from "../services/applicants";
import Textarea from "./ui/Textarea";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";

export default function ScheduleInteview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        interviewAt: new Date().toISOString().slice(0, 16), // ✅ default now
        interviewMode: "",
        interviewLocation: "",
        interviewNotes: ""
    });

    // 🔥 Dynamic label
    const locationLabel = useMemo(() => {
        if (formData.interviewMode === "In-Person") return "Location";
        if (formData.interviewMode === "Phone Call") return "Phone Number";
        if (formData.interviewMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location/Link";
    }, [formData.interviewMode]);


    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await scheduleInterview(
                applicantId,
                formData
            );

            if (success) {
                loadAfter();
                onClose();
                toast.success(message, { toastId: "success-submit" });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error on handleSubmit:", error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBackground>
            <Modal>
                <ModalHeader
                    title="Schedule Interview"
                    onClose={onClose}
                />

                {/* FORM */}
                <div className="space-y-4 mb-4">

                    <Input
                        label="Interview Date & Time"
                        required
                        name="interviewAt"
                        type="datetime-local"
                        value={formData.interviewAt}
                        onChange={handleInputChange}
                    />

                    <Select
                        label="Interview Mode"
                        required
                        name="interviewMode"
                        placeholder="Select Mode"
                        value={formData.interviewMode}
                        options={[
                            { value: "In-Person", name: "In-Person" },
                            { value: "Virtual (Video Call)", name: "Virtual (Video Call)" },
                            { value: "Phone Call", name: "Phone Call" }
                        ]}
                        onChange={handleInputChange}
                    />

                    <Input
                        label={locationLabel}
                        required
                        name="interviewLocation"
                        value={formData.interviewLocation}
                        onChange={handleInputChange}
                        placeholder={
                            formData.interviewMode === "In-Person"
                                ? "Enter office location"
                                : formData.interviewMode === "Phone Call"
                                    ? "Enter phone number"
                                    : "Paste meeting link"
                        }
                    />

                    <Textarea
                        label="Notes (optional)"
                        name="interviewNotes"
                        value={formData.interviewNotes}
                        onChange={handleInputChange}
                        placeholder="Add instructions, reminders, or details..."
                    />


                </div>

                <ModalFooter
                    submitLabel={isSubmitting ? "Scheduling..." : "Schedule Interview"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isSubmitting}
                />
            </Modal>
        </ModalBackground>
    );
}