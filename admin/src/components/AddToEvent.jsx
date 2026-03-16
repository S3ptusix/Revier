import { Calendar, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { addToEvent, fetchAllOrientationEvent } from "../services/orientationsServices";
import { cleanDateTime } from "../utils/format";

export default function AddToEvent({ applicantId, onClose = () => { }, loadAfter = () => { } }) {

    const [orientations, setOrientations] = useState([]);
    const handleSubmit = async (orientationId) => {
        try {
            const { success, message } = await addToEvent(applicantId, { orientationId });
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            console.error(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    useEffect(() => {
        try {
            const loadOrientations = async () => {
                const { success, message, orientationEvents } = await fetchAllOrientationEvent();
                if (success) {
                    setOrientations(orientationEvents);
                    return
                }
                console.error(message);
            }
            loadOrientations();
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    }, []);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Add to Event</p>
                <p className="text-sm text-gray-500 mb-8">
                    Select an event this applicant should attend to
                </p>

                <div className="mb-4 space-y-4">
                    {orientations?.map(orientation => (
                        <div
                            key={orientation?.id}
                            className="border border-gray-300 p-4 rounded-lg mb-4 cursor-pointer hover:border-emerald-500 space-y-4"
                            onClick={() => handleSubmit(orientation?.id)}
                        >
                            <p className="text-lg font-semibold">{orientation?.eventTitle}</p>
                            <div className="flex md:items-center justify-between max-md:flex-col gap-y-2">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Calendar size={16} className="shrink-0" />
                                    <p className="text-sm">{cleanDateTime(orientation?.eventAt)}</p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <MapPin size={16} className="shrink-0" />
                                    <p className="text-sm">{orientation?.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
