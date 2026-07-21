/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import { fetchOneInterview, rescheduleInterview } from "../services/applicants";
import Textarea from "./ui/Textarea";
import { formatDateTimeLocal, cleanDateTime } from "../utils/format";
import Loading from "./Loading";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";

export default function RescheduleInteview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [original, setOriginal] = useState(null);

    const { formData, setFormData, handleInputChange } = useForm({
        interviewAt: "",
        interviewMode: "",
        interviewLocation: "",
        interviewNotes: ""
    });

    // 🔥 dynamic label
    const locationLabel = useMemo(() => {
        if (formData.interviewMode === "In-Person") return "Location";
        if (formData.interviewMode === "Phone Call") return "Phone Number";
        if (formData.interviewMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location/Link";
    }, [formData.interviewMode]);

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await rescheduleInterview(
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
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);

                const { success, message, applicant } =
                    await fetchOneInterview(applicantId);

                if (success) {
                    const formatted = {
                        interviewAt: formatDateTimeLocal(applicant.interviewAt),
                        interviewMode: applicant.interviewMode,
                        interviewLocation: applicant.interviewLocation,
                        interviewNotes: applicant.interviewNotes || ""
                    };

                    setFormData(formatted);
                    setOriginal(formatted);
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, []);

    return (
        <ModalBackground>
            <Modal>
                <ModalHeader
                    title="Reschedule Interview"
                    onClose={onClose}
                />

                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {/* CURRENT INFO */}
                        {original && (
                            <div className="bg-gray-50 border rounded-lg p-3 mb-4 text-sm">
                                <p className="text-gray-500 mb-1">
                                    Current Schedule
                                </p>
                                <p>{cleanDateTime(original.interviewAt)}</p>
                                <p>{original.interviewMode}</p>
                                <p>{original.interviewLocation}</p>
                            </div>
                        )}

                        {/* FORM */}
                        <div className="space-y-4 mb-4">

                            <Input
                                label="New Date & Time"
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
                            />

                            <Textarea
                                label="Notes (optional)"
                                name="interviewNotes"
                                value={formData.interviewNotes}
                                onChange={handleInputChange}
                            />
                        </div>

                        <ModalFooter
                            submitLabel={isLoading ? "Rescheduling..." : "Save Changes"}
                            onSubmit={handleSubmit}
                            onClose={onClose}
                            disableSubmit={isSubmitting}
                        />
                    </>
                )}
            </Modal>
        </ModalBackground>
    );
}