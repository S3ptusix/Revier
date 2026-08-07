/* eslint-disable react-hooks/exhaustive-deps */
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
import { useForm } from "../hooks/form";
import ItemSelector from "./ui/ItemSelector";

export default function Blacklist({
    applicantId,
    onClose = () => { },
    loadAfter = () => { },
}) {

    const BLACKLIST_REASONS = [
        { item: 'Fraudulent Activity', value: 'The candidate was found to have engaged in fraudulent or dishonest behavior.' },
        { item: 'Falsified Information', value: 'The candidate provided false or misleading information during the application process.' },
        { item: 'Unprofessional Behavior', value: 'The candidate displayed inappropriate or unprofessional conduct.' },
        { item: 'No Show (Multiple Times)', value: 'The candidate failed to attend scheduled interviews or orientations multiple times without notice.' },
        { item: 'Policy Violation', value: 'The candidate violated company or recruitment policies.' },
        { item: 'Others', value: '' }
    ];

    const { formData, setFormData, handleInputChange } = useForm({
        blacklistedReason: "",
        blacklistedReasonNote: ""
    });
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // ✅ FINAL SUBMIT
    const handleSubmit = async () => {
        setLoading(true);

        try {
            const { success, message } = await blacklist(applicantId, formData);

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
                const { success, blacklistedReason, blacklistedReasonNote } = await fetchBlacklistReason(applicantId);
                if (success) {
                    setFormData(prev => ({
                        ...prev,
                        blacklistedReason: blacklistedReason || '',
                        blacklistedReasonNote: blacklistedReasonNote || ''
                    }));
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

                        <ItemSelector
                            items={BLACKLIST_REASONS}
                            itemSelected={formData.blacklistedReason}
                            onChange={(item) =>
                                setFormData(prev => ({
                                    ...prev,
                                    blacklistedReason: item.item,
                                    blacklistedReasonNote: item.value,
                                }))
                            }
                        />

                        <Textarea
                            label="Blacklist Notes"
                            name="blacklistedReasonNote"
                            placeholder="Add or generate notes..."
                            value={formData.blacklistedReasonNote}
                            onChange={handleInputChange}
                        />
                    </ModalBodyError>

                    <ModalFooter
                        submitLabel="Preview"
                        onSubmit={() => setShowPreviewModal(true)}
                        onClose={onClose}
                        disableSubmit={!formData.blacklistedReason.trim() || !formData.blacklistedReasonNote.trim()}
                    />
                </Modal>
            </ModalBackground>

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
                                        {formData.blacklistedReasonNote}
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
