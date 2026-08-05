import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Textarea from "./ui/Textarea";
import {
    InfoList,
    Modal,
    ModalBackground,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";
import { useForm } from "../hooks/form";
import { isWithinWorkingHours, minDateTime } from "../utils/tools";
import { forInterview } from "../services/newServices";
import {
    MEETING_APP_OPTIONS,
    generateMeetingAppInstructions
} from "../utils/meetingAppInstructions";
import InterviewMessageBuilderModal from "./InterviewMessageBuilderModal";

export default function ForInterview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔥 Builder Modal Toggle
    const [showBuilderModal, setShowBuilderModal] = useState(false);

    // 🔥 Preview Modal Toggle
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // 🔥 Builder State
    const [noteBuilder, setNoteBuilder] = useState({
        interviewType: "",
        preparation: [],
        arrival: "",
        attire: "",
        connection: ""
    });

    const { formData, setFormData, handleInputChange } = useForm({
        interviewAt: "",
        interviewMode: "",
        interviewLocation: "",
        interviewNotes: "",
        meetingApp: ""
    });

    // 🔥 Reset the selected meeting app whenever the interview mode
    // changes away from "Virtual (Video Call)"
    const handleModeChange = (e) => {
        const { value } = e.target;

        setFormData((prev) => ({
            ...prev,
            interviewMode: value,
            meetingApp: value === "Virtual (Video Call)" ? prev.meetingApp : ""
        }));
    };

    // 🔥 Dynamic label
    const locationLabel = useMemo(() => {
        if (formData.interviewMode === "In-Person") return "Location";
        if (formData.interviewMode === "Phone Call") return "Phone Number";
        if (formData.interviewMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location/Link";
    }, [formData.interviewMode]);


    // 🔥 Format the datetime-local value into a readable string
    const formattedSchedule = useMemo(() => {
        if (!formData.interviewAt) return "";

        const date = new Date(formData.interviewAt);
        if (isNaN(date)) return "";

        return date.toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }, [formData.interviewAt]);

    // 🔥 Auto-generated, non-editable schedule message
    // Built from Schedule, Interview Mode, and Location fields
    const scheduleSummary = useMemo(() => {
        if (!formData.interviewAt || !formData.interviewMode || !formData.interviewLocation) {
            return "";
        }

        let modePhrase = "";
        if (formData.interviewMode === "In-Person") {
            modePhrase = `in-person at ${formData.interviewLocation}`;
        } else if (formData.interviewMode === "Phone Call") {
            modePhrase = `via phone call at ${formData.interviewLocation}`;
        } else if (formData.interviewMode === "Virtual (Video Call)") {
            modePhrase = `via video call using the following link: ${formData.interviewLocation}`;
        } else {
            modePhrase = `at ${formData.interviewLocation}`;
        }

        return `Your interview is scheduled on ${formattedSchedule}, ${modePhrase}.`;
    }, [formData.interviewAt, formData.interviewMode, formData.interviewLocation, formattedSchedule]);

    // 🔥 Auto-generated joining instructions based on the selected
    // virtual meeting application (Zoom, Google Meet, Microsoft Teams)
    const virtualInstructions = useMemo(() => {
        if (formData.interviewMode !== "Virtual (Video Call)" || !formData.meetingApp) {
            return "";
        }

        return generateMeetingAppInstructions(
            formData.meetingApp,
            formData.interviewLocation
        );
    }, [formData.interviewMode, formData.meetingApp, formData.interviewLocation]);

    // 🔥 Final Notes = manually entered/built notes + auto-generated
    // app-specific joining instructions (when applicable). This is what
    // actually gets shown in the preview and submitted.
    const finalNotes = useMemo(() => {
        if (!virtualInstructions) return formData.interviewNotes;

        return [formData.interviewNotes, virtualInstructions]
            .filter(Boolean)
            .join("\n\n");
    }, [formData.interviewNotes, virtualInstructions]);

    // 🔥 Builder handlers
    const handleBuilderChange = (field, value) => {
        setNoteBuilder((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const togglePreparation = (item) => {
        setNoteBuilder((prev) => {
            const exists = prev.preparation.includes(item);
            return {
                ...prev,
                preparation: exists
                    ? prev.preparation.filter((i) => i !== item)
                    : [...prev.preparation, item]
            };
        });
    };

    // 🔥 Generate Notes
    const generateNotes = () => {
        const parts = [];

        if (noteBuilder.interviewType) {
            parts.push(`This will be a ${noteBuilder.interviewType}.`);
        }

        if (noteBuilder.preparation.length > 0) {
            parts.push(
                `Please prepare the following: ${noteBuilder.preparation.join(", ")}.`
            );
        }

        if (noteBuilder.arrival) {
            parts.push(`Kindly ${noteBuilder.arrival}.`);
        }

        if (noteBuilder.attire) {
            parts.push(`Please dress in ${noteBuilder.attire}.`);
        }

        if (noteBuilder.connection) {
            parts.push(noteBuilder.connection);
        }

        const finalMessage = parts.join(" ");

        setFormData((prev) => ({
            ...prev,
            interviewNotes: finalMessage
        }));

        setShowBuilderModal(false);
    };

    // 🔥 Validate then open preview instead of submitting directly
    const handleOpenPreview = () => {
        if (!formData.interviewAt || !formData.interviewMode || !formData.interviewLocation || !formData.interviewNotes) {
            toast.error("Please fill out required fields.");
            return;
        }

        if (formData.interviewMode === "Virtual (Video Call)" && !formData.meetingApp) {
            toast.error("Please select which application will be used for the video call.");
            return;
        }

        setShowPreviewModal(true);
    };

    const handleSubmit = async () => {

        if (!isWithinWorkingHours(formData.interviewAt)) {
            toast.error("Allowed time is 8:00 AM to 5:00 PM only");
            return;
        }

        try {


            setIsSubmitting(true);

            const { success, message } = await forInterview(
                applicantId,
                { ...formData, interviewNotes: finalNotes, scheduleSummary }
            );

            if (success) {
                loadAfter();
                setShowPreviewModal(false);
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

    return (
        <>
            {/* 🔥 MAIN MODAL */}
            <ModalBackground>
                <Modal>

                    <ModalHeader
                        title="Schedule Interview"
                        subTitle="Set interview details for this applicant"
                        onClose={onClose}
                    />

                    <ModalBody>

                        <InfoList
                            infoList={[
                                "Move the applicant to the Interview stage",
                                "Schedule their interview date and time",
                                "Notify the applicant with the interview details",
                            ]}
                        />

                        <Input
                            label="Schedule"
                            required
                            name="interviewAt"
                            type="datetime-local"
                            value={formData.interviewAt}
                            onChange={handleInputChange}
                            min={minDateTime}
                        />

                        <Select
                            label="Interview Mode"
                            placeholder="--"
                            required
                            name="interviewMode"
                            value={formData.interviewMode}
                            options={[
                                { value: "In-Person", name: "In-Person" },
                                { value: "Virtual (Video Call)", name: "Virtual (Video Call)" },
                                { value: "Phone Call", name: "Phone Call" }
                            ]}
                            onChange={handleModeChange}
                        />

                        <Input
                            label={locationLabel}
                            required
                            name="interviewLocation"
                            value={formData.interviewLocation}
                            onChange={handleInputChange}
                        />

                        {/* 🔥 Only shown when the interview will be conducted via video call */}
                        {formData.interviewMode === "Virtual (Video Call)" && (
                            <Select
                                label="Meeting Application"
                                placeholder="--"
                                required
                                name="meetingApp"
                                value={formData.meetingApp}
                                options={MEETING_APP_OPTIONS}
                                onChange={handleInputChange}
                            />
                        )}

                        <hr className="border-gray-300 mb-4" />

                        {/* 🔥 OPEN BUILDER */}
                        <button
                            type="button"
                            onClick={() => setShowBuilderModal(true)}
                            className="text-sm text-emerald-600 hover:underline mb-3"
                        >
                            + Build Message
                        </button>

                        {/* NOTES */}
                        <Textarea
                            label="Notes"
                            required
                            name="interviewNotes"
                            value={formData.interviewNotes}
                            onChange={handleInputChange}
                            placeholder="Add instructions or reminders..."
                        />


                    </ModalBody>
                    <ModalFooter
                        submitLabel="Schedule Interview"
                        onSubmit={handleOpenPreview}
                        onClose={onClose}
                        disableSubmit={isSubmitting}
                    />

                </Modal>
            </ModalBackground>

            {/* 🔥 BUILDER MODAL */}
            <InterviewMessageBuilderModal
                open={showBuilderModal}
                onClose={() => setShowBuilderModal(false)}
                noteBuilder={noteBuilder}
                handleBuilderChange={handleBuilderChange}
                togglePreparation={togglePreparation}
                generateNotes={generateNotes}
            />

            {/* 🔥 PREVIEW MODAL — shown before final confirmation */}
            {showPreviewModal && (
                <ModalBackground>
                    <Modal>

                        <div className="mb-6">
                            <ModalHeader
                                title="Preview Interview Message"
                                subTitle="Review the details before confirming"
                                onClose={() => setShowPreviewModal(false)}
                            />
                        </div>

                        <div className="space-y-4 mb-4">

                            {/* Auto-generated part — not editable */}
                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Schedule Details (auto-generated)
                                </p>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                                    <p>Schedule Details:</p>
                                    <p>{scheduleSummary}</p>
                                    <br />
                                    <p>Notes:</p>
                                    <p className="whitespace-pre-wrap">{finalNotes}</p>
                                    <br />
                                    <p>Please ensure you are available at the scheduled time.</p>
                                    <br />
                                    <p>Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.</p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400">
                                Need to make changes? Close this preview to edit the form.
                            </p>
                        </div>

                        <div className="mt-6">
                            <ModalFooter
                                submitLabel={isSubmitting ? "Scheduling..." : "Confirm & Schedule"}
                                onSubmit={handleSubmit}
                                onClose={() => setShowPreviewModal(false)}
                                disableSubmit={isSubmitting}
                            />
                        </div>

                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}