/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { applicantsFromOrientation, editOrientationStatus, removeFromEvent } from "../services/orientationsServices";

export default function TrackAttendance({ orientationId, onClose = () => { }, loadAfter = () => { } }) {

    const [applicants, setApplicants] = useState([]);

    const handleSubmit = async (applicantId, orientationStatus) => {
        try {

            // update UI immediately (radio behavior)
            setApplicants(prev =>
                prev.map(applicant =>
                    applicant.id === applicantId
                        ? { ...applicant, orientationStatus }
                        : applicant
                )
            );

            const { success, message } = await editOrientationStatus(applicantId, { orientationStatus });

            if (success) {
                loadAfter();
                return toast.success(message, { toastId: 'success-submit' });
            }

            console.error(message);

        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    const handleRemoveFromEvent = async (applicantId) => {
        try {

            // remove applicant from UI immediately
            setApplicants(prev =>
                prev.filter(applicant => applicant.id !== applicantId)
            );

            const { success, message } = await removeFromEvent(applicantId);

            if (success) return loadAfter();

            console.error(message);

        } catch (error) {
            console.error('Error on handleRemoveFromEvent:', error)
        }
    };

    useEffect(() => {
        const loadOrientations = async () => {
            const { success, message, applicants } = await applicantsFromOrientation(orientationId);

            if (success) {
                setApplicants(applicants);
                return;
            }

            console.error(message);
        };

        loadOrientations();

    }, []);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>

                <p className="text-lg font-semibold">Track Attendance</p>
                <p className="text-sm text-gray-500 mb-8">
                    Mark attendance
                </p>

                <div className="space-y-2">

                    {applicants?.map(applicant => (
                        <div key={applicant?.id} className="relative border border-gray-300 rounded-xl p-2 flex flex-col space-y-2">
                            <button
                                className="absolute top-2 right-2 cursor-pointer"
                                onClick={() => handleRemoveFromEvent(applicant?.id)}
                            >
                                <X size={16} />
                            </button>
                            <div className="grow flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex-center">
                                    {applicant?.fullname[0]}
                                </div>

                                <div>
                                    <p className="font-semibold">{applicant?.fullname}</p>
                                    <p className="text-gray-400 text-sm">{applicant?.job?.jobTitle}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    className={`btn bg-emerald-500 text-white rounded-lg ${applicant?.orientationStatus === 'Present' ? 'brightness-75' : ''}`}
                                    onClick={() => handleSubmit(applicant?.id, 'Present')}
                                >
                                    Present
                                </button>

                                <button
                                    className={`btn bg-red-500 text-white rounded-lg ${applicant?.orientationStatus === 'Absent' ? 'brightness-75' : ''}`}
                                    onClick={() => handleSubmit(applicant?.id, 'Absent')}
                                >
                                    Absent
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}