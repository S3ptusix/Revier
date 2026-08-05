import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import {
    blacklist,
    fetchBlacklistReason,
} from "../services/blacklistServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBodyError,
    ModalBody,
} from "./ui/ui-modal";

export default function Blacklist({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
}) {
    const [blacklistedReason, setBlacklistedReason] = useState("");
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [showBuilderModal, setShowBuilderModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const [reasonBuilder, setReasonBuilder] = useState({
        violation: "",
        detail: "",
    });

    // ✅ CLEAN REASON BUILDER (notes only)
    const generateReason = () => {
        const notes = [];

        if (reasonBuilder.violation) {
            notes.push(reasonBuilder.violation);
        }

        if (reasonBuilder.detail) {
            notes.push(reasonBuilder.detail);
        }

        if (notes.length === 0) {
            notes.push("The applicant did not meet the required standards during the recruitment process.");
        }

        const finalMessage = notes.join("\n");

        setBlacklistedReason(finalMessage);
        setShowBuilderModal(false);
    };

    // ✅ OPEN PREVIEW (instead of confirm)
    const handleConfirm = () => {
        if (!blacklistedReason.trim()) {
            return toast.error("Please provide a reason for blacklisting.");
        }

        setShowPreviewModal(true);
    };

    // ✅ FINAL SUBMIT
    const handleSubmit = async () => {
        setLoading(true);

        try {
            const { success, message } = await blacklist(applicantId, {
                blacklistedReason,
            });

            if (success) {
                toast.success(message);
                setShowPreviewModal(false);
                loadAfter();
                onClose();
                return;
            }

            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const { success, blacklistedReason } =
                    await fetchBlacklistReason(applicantId);

                if (success) {
                    setBlacklistedReason(blacklistedReason || "");
                }
            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, [applicantId]);

    return (
        <>
            <ModalBackground>
                <Modal>
                    <ModalBodyError
                        title="Blacklist Applicant"
                        subTitle="Provide a reason for blacklisting"
                        effectList={[
                            "Restrict the applicant from applying again.",
                        ]}
                    >

                        <button
                            type="button"
                            onClick={() => setShowBuilderModal(true)}
                            className="text-sm text-emerald-600 hover:underline mb-3"
                        >
                            + Build Blacklist Reason
                        </button>

                        <Textarea
                            label="Blacklist Notes"
                            placeholder="Add or generate notes..."
                            value={blacklistedReason}
                            onChange={(e) =>
                                setBlacklistedReason(e.target.value)
                            }
                        />
                    </ModalBodyError>

                    <ModalFooter
                        submitLabel="Preview"
                        onSubmit={handleConfirm}
                        onClose={onClose}
                        disableSubmit={!blacklistedReason.trim()}
                    />
                </Modal>
            </ModalBackground>

            {/* 🔥 BUILDER MODAL */}
            {showBuilderModal && (
                <ModalBackground>
                    <Modal>

                        <ModalHeader
                            title="Build Blacklist Notes"
                            subTitle="Generate a clear reason"
                            onClose={() => setShowBuilderModal(false)}
                        />

                        <ModalBody>

                            <Select
                                label="Violation Type"
                                placeholder="--"
                                value={reasonBuilder.violation}
                                onChange={(e) =>
                                    setReasonBuilder((prev) => ({
                                        ...prev,
                                        violation: e.target.value
                                    }))
                                }
                                options={[
                                    { value: "Submitted fraudulent or falsified documents.", name: "Fraudulent documents" },
                                    { value: "Used a fake or misleading identity.", name: "Fake identity" },
                                    { value: "Displayed abusive or inappropriate behavior.", name: "Abusive behavior" },
                                    { value: "Engaged in spam or suspicious applications.", name: "Spam applications" },
                                    { value: "Violated company policies during the recruitment process.", name: "Policy violation" }
                                ]}
                            />

                            <Select
                                label="Additional Detail"
                                placeholder="--"
                                value={reasonBuilder.detail}
                                onChange={(e) =>
                                    setReasonBuilder((prev) => ({
                                        ...prev,
                                        detail: e.target.value
                                    }))
                                }
                                options={[
                                    { value: "Reviewed and confirmed by the recruitment team.", name: "Reviewed and confirmed" },
                                    { value: "This compromises the integrity of the recruitment process.", name: "Integrity issue" },
                                ]}
                            />

                        </ModalBody>

                        <ModalFooter
                            submitLabel="Generate"
                            onSubmit={generateReason}
                            onClose={() => setShowBuilderModal(false)}
                        />
                    </Modal>
                </ModalBackground>
            )}

            {/* 🔥 PREVIEW MODAL (NEW CONFIRMATION) */}
            {showPreviewModal && (
                <ModalBackground>
                    <Modal>

                        <ModalHeader
                            title="Preview Blacklist Notification"
                            subTitle="Review the details before confirming"
                            onClose={() => setShowPreviewModal(false)}
                        />

                        <ModalBody>

                            <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">
                                    Application Message
                                </p>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm text-gray-800">

                                    <p>
                                        After review, we regret to inform you that your application has been restricted
                                        for the following reason:
                                    </p>

                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                        {blacklistedReason}
                                    </p>

                                    <p>
                                        As a result, you are currently not eligible to apply for opportunities within this company.
                                    </p>

                                    <p>Thank you for your understanding.</p>

                                </div>
                            </div>

                            <p className="text-xs text-gray-400">
                                Need to make changes? Close this preview to edit the form.
                            </p>
                        </ModalBody>

                        <ModalFooter
                            submitLabel={loading ? "Blacklisting..." : "Confirm & Send"}
                            onSubmit={handleSubmit}
                            onClose={() => setShowPreviewModal(false)}
                            disableSubmit={loading}
                            submitColor="RED"
                        />

                    </Modal>
                </ModalBackground>
            )}

        </>
    );

}
