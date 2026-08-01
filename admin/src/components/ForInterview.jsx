import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Textarea from "./ui/Textarea";
import {
    Modal,
    ModalBackground,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";
import { useForm } from "../hooks/form";
import { today } from "../utils/tools";
import { forInterview } from "../services/newServices";

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
        interviewNotes: ""
    });

    // 🔥 Dynamic label
    const locationLabel = useMemo(() => {
        if (formData.interviewMode === "In-Person") return "Location";
        if (formData.interviewMode === "Phone Call") return "Phone Number";
        if (formData.interviewMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location/Link";
    }, [formData.interviewMode]);

    // 🔥 Min datetime
    const minDateTime = `${today}T${new Date()
        .toTimeString()
        .slice(0, 5)}`;

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

        setShowPreviewModal(true);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await forInterview(
                applicantId,
                {...formData, scheduleSummary}
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

                    {/* HEADER */}
                    <div className="mb-6">
                        <ModalHeader
                            title="Schedule Interview"
                            subTitle="Set interview details for this applicant"
                            onClose={onClose}
                        />
                    </div>

                    {/* INFO BOX */}
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm font-semibold text-blue-700">
                            This action will:
                        </p>

                        <ul className="mt-2 list-disc pl-5 text-sm text-blue-600 space-y-1">
                            <li>
                                Move the applicant to the{" "}
                                <span className="font-semibold">Interview</span> stage
                            </li>
                            <li>Schedule their interview date and time</li>
                            <li>Notify the applicant with the interview details</li>
                        </ul>
                    </div>

                    {/* FORM */}
                    <div className="space-y-6 mb-4">

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
                            onChange={handleInputChange}
                        />

                        <Input
                            label={locationLabel}
                            required
                            name="interviewLocation"
                            value={formData.interviewLocation}
                            onChange={handleInputChange}
                        />
                    </div>

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

                    {/* FOOTER */}
                    <div className="mt-8">
                        <ModalFooter
                            submitLabel="Schedule Interview"
                            onSubmit={handleOpenPreview}
                            onClose={onClose}
                            disableSubmit={isSubmitting}
                        />
                    </div>

                </Modal>
            </ModalBackground>

            {/* 🔥 BUILDER MODAL */}
            {showBuilderModal && (
                <ModalBackground>
                    <Modal>

                        <div className="mb-6">
                            <ModalHeader
                                title="Build Interview Message"
                                subTitle="Generate a professional message"
                                onClose={() => setShowBuilderModal(false)}
                            />
                        </div>

                        <div className="space-y-4">

                            <Select
                                label="Interview Type"
                                placeholder="--"
                                value={noteBuilder.interviewType}
                                onChange={(e) =>
                                    handleBuilderChange("interviewType", e.target.value)
                                }
                                options={[
                                    { value: "technical interview", name: "Technical Interview" },
                                    { value: "initial screening", name: "Initial Screening" },
                                    { value: "final interview", name: "Final Interview" }
                                ]}
                            />

                            <div>
                                <p className="text-xs text-gray-500 mb-2">
                                    Preparation Required
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["Portfolio", "Valid ID", "Resume"].map((item) => {
                                        const active = noteBuilder.preparation.includes(item);

                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => togglePreparation(item)}
                                                className={`px-3 py-1 text-xs rounded-full border
                                                    ${active
                                                        ? "bg-emerald-500 text-white"
                                                        : "border-gray-300 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <Select
                                label="Arrival Instruction"
                                placeholder="--"
                                value={noteBuilder.arrival}
                                onChange={(e) =>
                                    handleBuilderChange("arrival", e.target.value)
                                }
                                options={[
                                    { value: "arrive at least 10 minutes early", name: "Arrive 10 minutes early" },
                                    { value: "be on time for your scheduled interview", name: "Be on time" }
                                ]}
                            />

                            <Select
                                label="Attire"
                                placeholder="--"
                                value={noteBuilder.attire}
                                onChange={(e) =>
                                    handleBuilderChange("attire", e.target.value)
                                }
                                options={[
                                    { value: "professional or business attire", name: "Professional Attire" },
                                    { value: "smart casual attire", name: "Smart Casual" }
                                ]}
                            />

                            <Select
                                label="Connection Requirement"
                                placeholder="--"
                                value={noteBuilder.connection}
                                onChange={(e) =>
                                    handleBuilderChange("connection", e.target.value)
                                }
                                options={[
                                    { value: "Ensure you have a stable internet connection.", name: "Stable Internet Required" },
                                    { value: "", name: "None" }
                                ]}
                            />

                        </div>

                        <div className="mt-6">
                            <ModalFooter
                                submitLabel="Generate Message"
                                onSubmit={generateNotes}
                                onClose={() => setShowBuilderModal(false)}
                            />
                        </div>

                    </Modal>
                </ModalBackground>
            )}

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
                                    <p className="underline">{formData.interviewNotes}</p>
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