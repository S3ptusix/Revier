import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import Textarea from "./ui/Textarea";
import {
    blacklist,
    fetchBlacklistReason,
} from "../services/rejectedServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
} from "./ui/ui-modal";

export default function Blacklist({
    applicantId,
    onClose = () => {},
    loadAfter = () => {},
}) {
    const [blacklistedReason, setBlacklistedReason] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleConfirm = () => {
        if (!blacklistedReason.trim()) {
            return toast.error("Please provide a reason for blacklisting.");
        }

        setShowConfirmModal(true);
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const { success, message } = await blacklist(applicantId, {
                blacklistedReason,
            });

            if (success) {
                toast.success(message);

                setShowConfirmModal(false);
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
                const {
                    success,
                    message,
                    blacklistedReason,
                } = await fetchBlacklistReason(applicantId);

                if (success) {
                    setBlacklistedReason(blacklistedReason || "");
                    return;
                }

                console.error(message);
            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, [applicantId]);

    return (
        <>
            <div className="modal-style">
                <div>
                    <div className="mb-8">
                        <Textarea
                            label="Blacklist Reason"
                            placeholder="Reason for blacklisting this applicant..."
                            value={blacklistedReason}
                            onChange={(e) =>
                                setBlacklistedReason(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            className="btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            className="btn grow bg-red-600 text-white hover:bg-red-700"
                            onClick={handleConfirm}
                            disabled={loading}
                        >
                            Blacklist
                        </button>
                    </div>
                </div>
            </div>

            {showConfirmModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Confirm Blacklist"
                            onClose={() => setShowConfirmModal(false)}
                        />

                        <div className="space-y-6">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle
                                    className="text-red-600"
                                    size={32}
                                />
                            </div>

                            <div className="text-center">
                                <p className="text-gray-700">
                                    Are you sure you want to permanently
                                    blacklist this applicant?
                                </p>

                                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                                    <p className="font-medium text-red-700">
                                        Blacklist Reason
                                    </p>

                                    <p className="mt-2 text-sm text-red-600 whitespace-pre-wrap">
                                        {blacklistedReason}
                                    </p>
                                </div>

                                <p className="mt-4 text-sm text-gray-500">
                                    The applicant will no longer be eligible for
                                    future applications unless removed from the
                                    blacklist.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="btn"
                                    onClick={() =>
                                        setShowConfirmModal(false)
                                    }
                                    disabled={loading}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Blacklisting..."
                                        : "Confirm Blacklist"}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}