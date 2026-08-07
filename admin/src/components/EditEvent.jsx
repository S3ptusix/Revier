/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, Lock } from "lucide-react";
import Input from "./ui/Input";
import Loading from "./Loading";
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
import { editOrientationEvent, fetchOneOrientationEvent } from "../services/orientationsServices";
import { formatDateTimeLocal } from "../utils/format";
import { generateMeetingAppInstructions, MEETING_APP_OPTIONS } from "../utils/meetingAppInstructions";
import { buildScheduleSummary } from "../utils/messageBuilder";
import OrientationMessageBuilder, {
    DEFAULT_PREPARATION_ITEMS,
    generateNoteFromBuilder,
    isBuilderComplete
} from "./OrientationMessageBuilder";
import ItemSelector from "./ui/ItemSelector";
import StepProgress from "./StepProgress";
import Textarea from "./ui/Textarea";

const TOTAL_STEPS = 3;

// 🔥 Per-step copy for the modal header — mirrors AddEvent's STEP_COPY so
// creating and editing an orientation event feel like the same product.
const STEP_COPY = {
    1: { title: "Edit Orientation Event", subtitle: "Update orientation details for this event" },
    2: { title: "Compose the Note", subtitle: "Answer a few quick prompts and we'll draft the note for you." },
    3: { title: "Preview Orientation Message", subtitle: "Review and edit the message before saving" }
};

export default function EditEvent({
    orientationId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔥 Wizard step: 1 = Initial Details, 2 = Compose the Note, 3 = Preview
    const [step, setStep] = useState(1);

    // 🔥 Builder State — preparation starts pre-filled with the checklist
    // items that are almost always expected from attendees; the user can
    // still remove or add to these via the TagInput.
    const [noteBuilder, setNoteBuilder] = useState({
        orientationType: "",
        preparation: DEFAULT_PREPARATION_ITEMS,
        arrival: "",
        attire: "",
        reminder: ""
    });

    const [selectedItems, setSelectedItems] = useState({
        orientationType: '',
        arrival: '',
        attire: ''
    });

    // 🔥 The final message shown on step 3 — generated exactly once, at
    // the moment the user clicks "Preview" in Step 2 (see handleRegeneratePreview
    // / goToPreview below). It is never generated or overwritten as a side
    // effect of other state changes — only that explicit user action, or a
    // fresh click of "Preview" after going back and changing something,
    // produces new content. From here it's a plain editable draft.
    const [previewMessage, setPreviewMessage] = useState("");
    const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        eventTitle: "",
        eventMode: "",
        meetingApp: "",
        location: "",
        eventAt: ""
    });

    // 🔥 Dynamic label
    const [locationLabel, setLocationLabel] = useState('Location');

    // 🔥 Load the event's current details and pre-fill Step 1. The note
    // itself was previously free text, so it can't be reverse-mapped into
    // builder answers — Step 2 starts fresh, same as Reschedule Interview.
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);

                const { success, message, orientation } = await fetchOneOrientationEvent(orientationId);

                if (success) {
                    setFormData({
                        eventTitle: orientation.eventTitle,
                        eventMode: orientation.eventMode,
                        meetingApp: orientation.meetingApp || "",
                        location: orientation.location,
                        eventAt: formatDateTimeLocal(orientation.eventAt)
                    });

                    setLocationLabel(
                        orientation.eventMode === "Virtual (Video Call)" ? "Meeting Link" : "Location"
                    );
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
    }, [orientationId]);

    // 🔥 Step 1 is complete once title, schedule, mode, and location are
    // set — and, when the mode is virtual, the meeting app is chosen too.
    const basicDetailsComplete = Boolean(
        formData.eventTitle &&
        formData.eventAt &&
        formData.eventMode &&
        formData.location &&
        (formData.eventMode !== "Virtual (Video Call)" || formData.meetingApp)
    );

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

    // 🔥 Auto-generated, non-editable schedule message — sent alongside
    // the note but not itself shown in the editable Step 3 textarea.
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

    // 🔥 Note body = the builder's generated note + auto-generated
    // app-specific joining instructions (when applicable). Neither piece
    // is directly user-editable until step 3.
    const generatedNote = useMemo(() => generateNoteFromBuilder(noteBuilder), [noteBuilder]);
    const finalNotes = useMemo(() => {
        return [generatedNote, virtualInstructions].filter(Boolean).join("\n\n");
    }, [generatedNote, virtualInstructions]);

    // 🔥 The message body — this is what step 3 renders as an editable
    // textarea, and exactly what gets submitted as the note. Orientation
    // details are rendered separately, read-only, in step 3.
    const buildMessageBody = (notes) => [notes].join("\n");

    // 🔥 Builder handlers
    const handleBuilderChange = (field, value) => {
        setNoteBuilder((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const builderComplete = isBuilderComplete(noteBuilder);

    // 🔥 The ONLY place the message is generated. Called exclusively by
    // goToPreview, i.e. only when the user clicks "Preview" in Step 2.
    // Nothing else in this component writes to previewMessage.
    const handleRegeneratePreview = () => {
        setPreviewMessage(buildMessageBody(finalNotes));
        setHasGeneratedPreview(true);
    };

    // 🔥 Step 1 -> Step 2
    const goToBuilder = () => {
        if (!basicDetailsComplete) {
            toast.error("Please fill out required fields.");
            return;
        }
        if (formData.eventMode === "Virtual (Video Call)" && !formData.meetingApp) {
            toast.error("Please select which app will be used for the virtual session.");
            return;
        }
        setStep(2);
    };

    // 🔥 Step 2 -> Step 3
    const goToPreview = () => {
        if (!builderComplete) {
            toast.error("Please complete the required fields before previewing.");
            return;
        }
        handleRegeneratePreview();
        setStep(3);
    };

    const goBack = () => setStep((prev) => Math.max(1, prev - 1));

    const handleSubmit = async () => {
        if (!isWithinWorkingHours(formData.eventAt)) {
            toast.error("Allowed time is 8:00 AM to 5:00 PM only");
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message } = await editOrientationEvent(
                orientationId,
                {
                    ...formData,
                    note: previewMessage,
                    scheduleSummary
                }
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
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBackground>
            <Modal>

                <ModalHeader
                    title={isLoading ? "Edit Orientation Event" : STEP_COPY[step].title}
                    subTitle={isLoading ? "Loading current orientation details..." : STEP_COPY[step].subtitle}
                    onClose={onClose}
                />

                {isLoading ? (
                    <ModalBody>
                        <div className="py-10 flex justify-center">
                            <Loading />
                        </div>
                    </ModalBody>
                ) : (
                    <>
                        <ModalBody>

                            {step === 1 && (
                                <InfoList
                                    infoList={[
                                        "Update the orientation's schedule, mode, or location",
                                        "Regenerate the attendee notification message",
                                        "Preview everything before saving your changes",
                                    ]}
                                />
                            )}

                            <StepProgress step={step} totalSteps={TOTAL_STEPS} />

                            {/* 🔥 STEP 1 — Initial Details */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <Input
                                        label="Event Title"
                                        required
                                        name="eventTitle"
                                        placeholder="e.g., New Hire Orientation - February"
                                        value={formData.eventTitle}
                                        onChange={handleInputChange}
                                    />

                                    <ItemSelector
                                        label="Orientation Mode"
                                        required
                                        items={[
                                            { item: "In-Person", value: "In-Person" },
                                            { item: "Virtual (Video Call)", value: "Virtual (Video Call)" },
                                        ]}
                                        itemSelected={formData.eventMode}
                                        onChange={(item) => {
                                            setFormData(prev => ({
                                                ...prev,
                                                eventMode: item.value,
                                                meetingApp: item.value === 'In-Person' ? '' : prev.meetingApp
                                            }));
                                            setLocationLabel(item.value === 'In-Person' ? "Location" : "Meeting Link");
                                        }}
                                    />

                                    {formData.eventMode === "Virtual (Video Call)" && (
                                        <ItemSelector
                                            label="Meeting App"
                                            required
                                            items={MEETING_APP_OPTIONS}
                                            itemSelected={formData.meetingApp}
                                            onChange={(item) => (
                                                setFormData(prev => ({
                                                    ...prev,
                                                    meetingApp: item.value
                                                }))
                                            )}
                                        />
                                    )}

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
                                </div>
                            )}

                            {/* 🔥 STEP 2 — Message Builder (configuration only, no note editing) */}
                            {step === 2 && (
                                <OrientationMessageBuilder
                                    selectedItems={selectedItems}
                                    setSelectedItems={setSelectedItems}
                                    noteBuilder={noteBuilder}
                                    handleBuilderChange={handleBuilderChange}
                                />
                            )}

                            {/* 🔥 STEP 3 — Preview: orientation details are locked, message body
                                is editable. Gated on hasGeneratedPreview so nothing renders here
                                unless the message was actually generated via the Step 2 "Preview"
                                click. Once here, the builder from Step 2 is no longer shown. */}
                            {step === 3 && hasGeneratedPreview && (
                                <>
                                    <div>
                                        <p className="text-xs mb-1">Schedule Details:</p>
                                        <div className="rounded-xl border border-gray-200 bg-gray-100 p-4 text-sm text-gray-700">
                                            <span className="text-gray-500">{scheduleSummary}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs mb-1">Notes:</p>
                                        <Textarea
                                            value={previewMessage}
                                            onChange={(e) => setPreviewMessage(e.target.value)}
                                        />
                                    </div>

                                    <div className="rounded-xl border border-gray-200 bg-gray-100 p-4 text-sm text-gray-700">
                                        <span className="text-gray-500">Please ensure you are available at the scheduled time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.</span>
                                    </div>
                                </>
                            )}

                        </ModalBody>

                        <ModalFooter
                            submitLabel={
                                step < 1 ? "Next" : isSubmitting ? "Saving..." : "Confirm & Save"
                            }
                            cancelLabel="Preview"
                            onSubmit={
                                step === 1
                                    ? goToBuilder
                                    : step === 2
                                        ? goToPreview
                                        : handleSubmit
                            }
                            onClose={step === 1 ? null : goBack}
                            disableSubmit={
                                (step === 1 && !basicDetailsComplete) ||
                                (step === 2 && !builderComplete) ||
                                (step === 3 && isSubmitting)
                            }
                        />
                    </>
                )}

            </Modal>
        </ModalBackground>
    );
}