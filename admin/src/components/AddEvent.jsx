/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import Textarea from "./ui/Textarea";
import { useForm } from "../hooks/form";
import { createOrientationEvent } from "../services/orientationsServices";
import { CalendarDays, MapPin } from "lucide-react";
import { isWithinWorkingHours, minDateTime } from "../utils/tools";
import { generateMeetingAppInstructions, MEETING_APP_OPTIONS } from "../utils/meetingAppInstructions";
import OrientationMessageBuilderModal from "./OrientationMessageBuilderModal";
import { buildScheduleSummary } from "../utils/messageBuilder";

// 🔥 Strips any previously auto-generated app-instructions block from a note
const stripAppInstructionsBlock = (note = "") =>
    note.replace(/How to Join via [^:]+:[\s\S]*?(?=\n\n|$)/, "").trim();

export default function AddEvent({ onClose = () => { }, loadAfter = () => { } }) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔥 Builder Modal Toggle
    const [showBuilderModal, setShowBuilderModal] = useState(false);

    // 🔥 Preview Modal Toggle
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // 🔥 Builder State
    const [noteBuilder, setNoteBuilder] = useState({
        orientationType: "",
        preparation: [],
        arrival: "",
        attire: "",
        reminder: ""
    });

    const { formData, setFormData, handleInputChange } = useForm({
        eventTitle: '',
        eventMode: '',
        meetingApp: '',
        location: '',
        eventAt: '',
        note: ''
    });

    // 🔥 Dynamic label — switches between physical location and meeting link
    const locationLabel = useMemo(() => {
        if (formData.eventMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location";
    }, [formData.eventMode]);

    // 🔥 Format the datetime-local value into a readable string
    const formattedSchedule = useMemo(() => {
        if (!formData.eventAt) return "";

        const date = new Date(formData.eventAt);
        if (isNaN(date)) return "";

        return date.toLocaleString(undefined, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }, [formData.eventAt]);

    // 🔥 Auto-generated, non-editable schedule message
    // Built from Event Title, Orientation Mode, Location, and Date fields
    const scheduleSummary = useMemo(() => {
        return buildScheduleSummary({
            eventTitle: formData.eventTitle,
            eventAt: formData.eventAt,
            location: formData.location,
            eventMode: formData.eventMode,
        });
    }, [
        formData.eventTitle,
        formData.eventAt,
        formData.location,
        formData.eventMode,
        formData.meetingApp,
        formattedSchedule
    ]);

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

        if (noteBuilder.orientationType) {
            parts.push(`This will be a ${noteBuilder.orientationType}.`);
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

        if (noteBuilder.reminder) {
            parts.push(noteBuilder.reminder);
        }

        const finalMessage = parts.join(" ");

        setFormData((prev) => ({
            ...prev,
            note: finalMessage
        }));

        setShowBuilderModal(false);
    };

    // 🔥 Validate then open preview instead of submitting directly
    const handleOpenPreview = () => {
        if (!formData.eventTitle || !formData.eventMode || !formData.location || !formData.eventAt) {
            toast.error("Please fill out required fields.");
            return;
        }

        if (formData.eventMode === "Virtual (Video Call)" && !formData.meetingApp) {
            toast.error("Please select which app will be used for the virtual session.");
            return;
        }

        setShowPreviewModal(true);
    };


    // 🔥 Auto-generated joining instructions based on the selected
    // virtual meeting application (Zoom, Google Meet, Microsoft Teams)
    const virtualInstructions = useMemo(() => {
        if (formData.eventMode !== "Virtual (Video Call)" || !formData.meetingApp) {
            return "";
        }

        return generateMeetingAppInstructions(
            formData.meetingApp,
            formData.location
        );
    }, [formData.eventMode, formData.meetingApp, formData.location]);

    // 🔥 Final Notes = manually entered/built notes + auto-generated
    // app-specific joining instructions (when applicable). This is what
    // actually gets shown in the preview and submitted.
    const finalNotes = useMemo(() => {
        if (!virtualInstructions) return formData.note;

        return [formData.note, virtualInstructions]
            .filter(Boolean)
            .join("\n\n");
    }, [formData.note, virtualInstructions]);

    const handleSubmit = async () => {
        if (!isWithinWorkingHours(formData.eventAt)) {
            toast.error("Allowed time is 8:00 AM to 5:00 PM only");
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message } = await createOrientationEvent({
                ...formData,
                note: finalNotes,
                scheduleSummary
            });

            if (success) {
                toast.success(message || "Event created successfully");

                setFormData(prev => ({ ...prev, note: finalNotes }));

                loadAfter();
                setShowPreviewModal(false);
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
        <>
            {/* 🔥 MAIN MODAL */}
            <ModalBackground>
                <Modal>

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

                        {/* ORIENTATION MODE */}
                        <Select
                            label="Orientation Mode"
                            placeholder="--"
                            required
                            name="eventMode"
                            value={formData.eventMode}
                            options={[
                                { value: "In-Person", name: "In-Person" },
                                { value: "Virtual (Video Call)", name: "Virtual (Video Call)" }
                            ]}
                            onChange={(e) => {
                                handleInputChange(e);
                                if (e.target.value !== "Virtual (Video Call)") {
                                    setFormData((prev) => ({
                                        ...prev,
                                        meetingApp: "",
                                        note: stripAppInstructionsBlock(prev.note)
                                    }));
                                }
                            }}
                        />

                        {/* MEETING APP */}
                        {formData.eventMode === "Virtual (Video Call)" && (
                            <Select
                                label="Meeting App"
                                placeholder="--"
                                required
                                name="meetingApp"
                                value={formData.meetingApp}
                                options={MEETING_APP_OPTIONS}
                                onChange={handleInputChange}
                            />
                        )}

                        {/* LOCATION */}
                        <Input
                            label={locationLabel}
                            required
                            name="location"
                            placeholder={
                                formData.eventMode === "Virtual (Video Call)"
                                    ? "e.g., https://zoom.us/j/..."
                                    : "e.g., Main Conference Room"
                            }
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

                        <hr className="border-gray-300" />

                        {/* 🔥 OPEN BUILDER */}
                        <button
                            type="button"
                            onClick={() => setShowBuilderModal(true)}
                            className="text-sm text-emerald-600 hover:underline"
                        >
                            + Build Message
                        </button>

                        {/* NOTES */}
                        <Textarea
                            label="Notes"
                            required
                            name="note"
                            placeholder="Add agenda, instructions, or reminders..."
                            value={formData.note}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* FOOTER */}
                    <ModalFooter
                        submitLabel="Create Event"
                        onSubmit={handleOpenPreview}
                        onClose={onClose}
                        disableSubmit={isSubmitting}
                    />
                </Modal>
            </ModalBackground>

            {/* 🔥 BUILDER MODAL */}
            <OrientationMessageBuilderModal
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
                                title="Preview Orientation Event"
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
                                    <p>Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.</p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400">
                                Need to make changes? Close this preview to edit the form.
                            </p>
                        </div>

                        <div className="mt-6">
                            <ModalFooter
                                submitLabel={isSubmitting ? "Creating..." : "Confirm & Create"}
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