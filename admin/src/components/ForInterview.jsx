import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Sparkles, ArrowLeft, Lock, Info } from "lucide-react";
import Input from "./ui/Input";
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
import InterviewMessageBuilder, {
    DEFAULT_PREPARATION_ITEMS,
    generateNoteFromBuilder,
    isBuilderComplete
} from "./InterviewMessageBuilder";
import ItemSelector from "./ui/ItemSelector";
import StepProgress from "./StepProgress";
import Textarea from './ui/Textarea'
import { renderMessageWithLinks } from "./renderMessageWithLinks";

const TOTAL_STEPS = 3;

// 🔥 Per-step copy for the modal header
const STEP_COPY = {
    1: { title: "Schedule Interview", subtitle: "Set interview details for this applicant" },
    2: { title: "Compose the Note", subtitle: "Answer a few quick prompts and we'll draft the note for you." },
    3: { title: "Preview Interview Message", subtitle: "Review and edit the message before sending" }
};

export default function ForInterview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔥 Wizard step: 1 = Interview Details, 2 = Compose the Note, 3 = Preview
    const [step, setStep] = useState(1);

    // 🔥 Builder State — preparation starts pre-filled with the documents
    // that are almost always expected from candidates; the user can still
    // remove or add to these via the TagInput.
    const [noteBuilder, setNoteBuilder] = useState({
        interviewType: "",
        preparation: DEFAULT_PREPARATION_ITEMS,
        arrival: "",
        attire: ""
    });

    const [selectedItems, setSelectedItems] = useState({
        interviewType: '',
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
        interviewAt: "",
        interviewMode: "",
        interviewLocation: "",
        meetingApp: ""
    });

    // 🔥 Dynamic label
    const [locationLabel, setLocationLabel] = useState('Location');

    // 🔥 Step 1 is complete once schedule, mode, and location are set —
    // and, when the mode is virtual, the meeting app is chosen too.
    const basicDetailsComplete = Boolean(
        formData.interviewAt &&
        formData.interviewMode &&
        formData.interviewLocation &&
        (formData.interviewMode !== "Virtual (Video Call)" || formData.meetingApp)
    );

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

    // 🔥 Auto-generated schedule summary line
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
            modePhrase = `via video call using the following link: [${formData.interviewLocation}](${formData.interviewLocation})`;
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
            `[${formData.interviewLocation}](${formData.interviewLocation})`
        );
    }, [formData.interviewMode, formData.meetingApp, formData.interviewLocation]);

    // 🔥 Note body = the builder's generated note + auto-generated
    // app-specific joining instructions (when applicable). Neither piece
    // is directly user-editable until step 3.
    const generatedNote = useMemo(() => generateNoteFromBuilder(noteBuilder), [noteBuilder]);
    const finalNotes = useMemo(() => {
        return [generatedNote, virtualInstructions].filter(Boolean).join("\n\n");
    }, [generatedNote, virtualInstructions]);

    // 🔥 The message body — this is what step 3 renders as an editable
    // textarea, and exactly what gets submitted as interviewNotes. Schedule
    // details are rendered separately, read-only, in step 3.
    const buildMessageBody = (notes) => [
        notes
    ].join("\n");

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
        if (formData.interviewMode === "Virtual (Video Call)" && !formData.meetingApp) {
            toast.error("Please select which application will be used for the video call.");
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

        if (!isWithinWorkingHours(formData.interviewAt)) {
            toast.error("Allowed time is 8:00 AM to 5:00 PM only");
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message } = await forInterview(
                applicantId,
                { ...formData, interviewNotes: previewMessage, scheduleSummary }
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

    return (
        <ModalBackground>
            <Modal>

                <ModalHeader
                    title={STEP_COPY[step].title}
                    subTitle={STEP_COPY[step].subtitle}
                    onClose={onClose}
                />

                <ModalBody>

                    {step === 1 && (
                        <InfoList
                            infoList={[
                                "Move the applicant to the Interview stage",
                                "Schedule their interview date and time",
                                "Notify the applicant with the interview details",
                            ]}
                        />
                    )}

                    <StepProgress step={step} totalSteps={TOTAL_STEPS} />

                    {/* 🔥 STEP 1 — Interview Details */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <Input
                                label="Schedule"
                                required
                                name="interviewAt"
                                type="datetime-local"
                                value={formData.interviewAt}
                                onChange={handleInputChange}
                                min={minDateTime}
                            />

                            <ItemSelector
                                label="Interview Mode"
                                required
                                items={[
                                    { item: "In-Person", value: "In-Person" },
                                    { item: "Virtual (Video Call)", value: "Virtual (Video Call)" },
                                ]}
                                itemSelected={formData.interviewMode}
                                onChange={(item) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        interviewMode: item.value,
                                        meetingApp: item.value === 'In-Person' ? '' : prev.meetingApp
                                    }));
                                    setLocationLabel(item.value === 'In-Person' ? "Location" : "Meeting Link");
                                }}
                            />

                            {formData.interviewMode === "Virtual (Video Call)" && (
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
                                name="interviewLocation"
                                value={formData.interviewLocation}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}

                    {/* 🔥 STEP 2 — Message Builder (configuration only, no note editing) */}
                    {step === 2 && (
                        <InterviewMessageBuilder
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            noteBuilder={noteBuilder}
                            handleBuilderChange={handleBuilderChange}
                        />
                    )}

                    {/* 🔥 STEP 3 — Preview: schedule is locked, message body is editable.
                        Gated on hasGeneratedPreview so nothing renders here unless the
                        message was actually generated via the Step 2 "Preview" click. */}
                    {step === 3 && hasGeneratedPreview && (
                        <>
                            <div>
                                <p className="text-xs mb-1">Schedule Details:</p>
                                <div className="rounded-xl border border-gray-200 bg-gray-100 p-4 text-sm text-gray-700">
                                    <span className="text-gray-500">{renderMessageWithLinks(scheduleSummary)}</span>
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
                                <span className="text-gray-500">Please ensure you are available at the scheduled time.</span>
                                <br /><br />
                                <span className="text-gray-500">Please attend the session on time. Candidates who are present will proceed with hiring, while those who are unable to attend will be considered not selected.</span>
                            </div>
                        </>
                    )}

                </ModalBody>

                <ModalFooter
                    submitLabel={
                        step < 3 ? "Next" : isSubmitting ? "Scheduling..." : "Confirm & Schedule"
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

            </Modal>
        </ModalBackground>
    );
}