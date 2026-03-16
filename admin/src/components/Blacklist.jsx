/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Textarea from "./ui/Textarea";
import { blacklist, fetchBlacklistReason } from "../services/rejectedBlacklistedServices";

export default function Blacklist({
    applicantId,
    onClose = () => { },
    loadAfter = () => { }
}) {

    const [blacklistedReason, setBlacklistedReason] = useState('');

    const handleSubmit = async () => {
        try {
            const { success, message } = await blacklist(applicantId, { blacklistedReason });
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, blacklistedReason } = await fetchBlacklistReason(applicantId);
                if (success) return setBlacklistedReason(blacklistedReason || '');
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [])

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Blacklist</p>

                <div className="mb-8">
                    <Textarea
                        label="Blacklisted Reason"
                        placeholder="Reason for this applicant being blacklisted..."
                        required={true}
                        value={blacklistedReason}
                        onChange={(e) => setBlacklistedReason(e.target.value)}
                    />
                </div>

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-red-500 text-white"
                        onClick={handleSubmit}
                    >
                        Blacklist
                    </button>
                </div>
            </div>
        </div>
    );
}
