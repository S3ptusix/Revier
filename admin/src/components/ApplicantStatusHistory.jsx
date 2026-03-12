/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { applicantStatusHistory } from "../services/applicants";
import { cleanDateTime } from "../utils/format";


export default function ApplicantStatusHistory({ applicantId, onClose = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {

        const loadData = async () => {
            const { success, message, statusHistory } = await applicantStatusHistory(applicantId);
            if (success) return setData(statusHistory);
            setErrorMessage(message);
        }
        loadData();
    }, [applicantId]);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">
                    Recruitment History</p>
                <p className="text-sm text-gray-500 mb-8">Full recruitment history</p>

                <div className="space-y-2">
                    {data?.map((d, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <div className="bg-gray-300 w-0.5 grow"></div>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{d?.applicantStatus}</p>
                                <p className="text-sm text-gray-500">{cleanDateTime(d?.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
