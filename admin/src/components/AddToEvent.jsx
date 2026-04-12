import { Calendar, MapPin, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { addToEvent, fetchAllOrientationEvent } from "../services/orientationsServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";

export default function AddToEvent({ applicantId, onClose = () => { }, loadAfter = () => { } }) {

    const [orientations, setOrientations] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    })

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
                const { success, message, orientationEvents, pagination: apiPagination } = await fetchAllOrientationEvent({ page });
                if (success) {
                    setOrientations(orientationEvents);
                    setPagination(apiPagination);
                    return
                }
                console.error(message);
            }
            loadOrientations();
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    }, [page]);

    return (
        <div className="modal-style">
            <div className="h-screen flex flex-col">
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Add to Event</p>
                <p className="text-sm text-gray-500 mb-8">
                    Select an event this applicant should attend to
                </p>

                <div className="grow mb-4 space-y-4 overflow-auto">
                    {orientations?.map(orientation => (
                        <div
                            key={orientation?.id}
                            className="group border border-gray-300 p-4 rounded-lg mb-4 cursor-pointer hover:bg-emerald-500 hover:text-white space-y-4 duration-150"
                            onClick={() => handleSubmit(orientation?.id)}
                        >
                            <p className="text-lg font-semibold">{orientation?.eventTitle}</p>
                            <div className="flex md:items-center justify-between max-md:flex-col gap-y-2">
                                <div className="flex items-center gap-2 text-gray-500 group-hover:text-white duration-150">
                                    <Calendar size={16} className="shrink-0" />
                                    <p className="text-sm">{cleanDateTime(orientation?.eventAt)}</p>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 group-hover:text-white duration-150">
                                    <MapPin size={16} className="shrink-0" />
                                    <p className="text-sm">{orientation?.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
}
