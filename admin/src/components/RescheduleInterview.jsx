/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import Textarea from "./ui/Textarea";
import Loading from "./Loading";
import {
    Modal,
    ModalBackground,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";
import { useForm } from "../hooks/form";
import { fetchOneInterview } from "../services/applicantServices";
import { rescheduleInterview } from "../services/interviewServices";
import { formatDateTimeLocal } from "../utils/format";
import { today } from "../utils/tools";

export default function RescheduleInterview({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialData, setInitialData] = useState(null);

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

    const locationLabel = useMemo(() => {
        if (formData.interviewMode === "In-Person") return "Location";
        if (formData.interviewMode === "Phone Call") return "Phone Number";
        if (formData.interviewMode === "Virtual (Video Call)") return "Meeting Link";
        return "Location/Link";
    }, [formData.interviewMode]);

    const isSameData = () => {
        if (!initialData) return false;

        return (
            formData.interviewAt === initialData.interviewAt &&
            formData.interviewMode === initialData.interviewMode &&
            formData.interviewLocation === initialData.interviewLocation &&
            (formData.interviewNotes || "") === (initialData.interviewNotes || "")
        );
    };

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

        return `Your interview has been rescheduled to ${formattedSchedule}, ${modePhrase}.`;
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

        // 🔥 close modal after generate
        setShowBuilderModal(false);
    };

    // 🔥 Validate then open preview instead of submitting directly
    const handleOpenPreview = () => {
        if (isSameData()) {
            toast.info("No changes made.");
            return;
        }

        if (!formData.interviewAt || !formData.interviewMode || !formData.interviewLocation || !formData.interviewNotes) {
            toast.error("Please fill out required fields.");
            return;
        }

        setShowPreviewModal(true);
    };

    const handleSubmit = async () => {
        if (isSameData()) {
            toast.info("No changes made.");
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message } = await rescheduleInterview(
                applicantId,
                { ...formData, scheduleSummary }
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

    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);

                const { success, applicant } =
                    await fetchOneInterview(applicantId);

                if (success) {
                    console.log({ interviewAt: applicant.interviewAt });
                    const formatted = {
                        interviewAt: formatDateTimeLocal(applicant.interviewAt),
                        interviewMode: applicant.interviewMode,
                        interviewLocation: applicant.interviewLocation,
                        interviewNotes: applicant.interviewNotes || ""
                    };

                    setFormData(formatted);
                    setInitialData(formatted);
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
        <>
            {/* 🔥 MAIN MODAL */}
            <ModalBackground>
                <Modal>
                    <div className="mb-6">
                        <ModalHeader
                            title="Reschedule Interview"
                            subTitle="Update interview schedule and details"
                            onClose={onClose}
                        />
                    </div>

                    {isLoading ? (
                        <div className="py-10 flex justify-center">
                            <Loading />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-6 mb-4">

                                <Input
                                    label="New Schedule"
                                    required
                                    name="interviewAt"
                                    type="datetime-local"
                                    value={formData.interviewAt}
                                    onChange={handleInputChange}
                                    min={minDateTime}
                                />

                                <Select
                                    label="Interview Mode"
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

                            {/* 🔥 AUTO-GENERATED MESSAGE PREVIEW (read-only) */}
                            {scheduleSummary && (
                                <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">
                                        Auto-generated message (not editable)
                                    </p>
                                    <p className="text-sm text-gray-700">{scheduleSummary}</p>
                                </div>
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

                            {/* 🔥 NOTES */}
                            <Textarea
                                label="Notes"
                                required
                                name="interviewNotes"
                                value={formData.interviewNotes}
                                onChange={handleInputChange}
                                placeholder="Add instructions or reminders..."
                            />

                            {!isSameData() && (
                                <p className="text-xs text-emerald-600 mt-2">
                                    You have unsaved changes
                                </p>
                            )}

                            <div className="mt-6">
                                <ModalFooter
                                    submitLabel="Save Changes"
                                    onSubmit={handleOpenPreview}
                                    onClose={onClose}
                                    disableSubmit={isSubmitting || isSameData()}
                                />
                            </div>
                        </>
                    )}
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
                                    Reschedule Details (auto-generated)
                                </p>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                                    <p>Updated Details:</p>
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
                                submitLabel={isSubmitting ? "Rescheduling..." : "Confirm & Save"}
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