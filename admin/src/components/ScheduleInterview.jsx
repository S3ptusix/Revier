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

export default function ScheduleInteview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [errorMessage, setErrorMessage] = useState("");
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

    // ✅ Validation
    const isValid =
        formData.interviewAt &&
        formData.interviewMode &&
        formData.interviewLocation;

    const handleSubmit = async () => {
        try {
            setErrorMessage("");

            if (!isValid) {
                setErrorMessage("Please fill all required fields");
                return;
            }

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
                setErrorMessage(message);
            }
        } catch (error) {
            console.error("Error on handleSubmit:", error);
            setErrorMessage("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-style">
            <div className="max-w-md mx-auto">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-lg font-semibold">
                        Schedule Interview
                    </p>
                    <button className="onClose-btn" onClick={onClose}>
                        <X size={16} />
                    </button>
                </div>

                {/* FORM */}
                <div className="space-y-4">

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

                    {/* ERROR */}
                    {errorMessage && (
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    )}

                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                    <button
                        className="btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <button
                        className={`
                            flex-1 btn text-white
                            ${isValid
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-gray-300 cursor-not-allowed"}
                        `}
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                    >
                        {isSubmitting ? "Scheduling..." : "Schedule Interview"}
                    </button>
                </div>
            </div>
        </div>
    );
}