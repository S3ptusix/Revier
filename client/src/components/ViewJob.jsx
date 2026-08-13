/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowLeft, Award, Banknote, Bookmark, BookmarkCheck, Briefcase, Building2, CircleCheckBig, Clock, GraduationCap, MapPin, User } from "lucide-react";
import { useState } from "react";
import Apply from "./Apply";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { applyStatus } from "../services/userServices";
import { formatNumberWithCommas } from "../utils/format-money";
import { formatPostedDate } from "../utils/format-datetime";
import { formatPayType } from "../utils/format-word";
import { ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";

export default function ViewJob({
    job,
    onClose = () => { },
    handleSaveJob = () => { },
    savedJobsList = []
}) {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);

    const [userApplyStatus, setUserApplyStatus] = useState({ success: false, message: 'Apply' });

    const [showApply, setShowApply] = useState(false);

    const handleApply = () => {
        if (!user) {
            navigate('/register');
        } else {
            setShowApply(true);
        }
    }

    useEffect(() => {
        try {
            const handleIsAppliedToTheJob = async () => {
                if (!user) return setUserApplyStatus({ success: true, message: 'Apply' });
                const { success, canApply, message } = await applyStatus(job.id);
                if (success) return setUserApplyStatus({ success: canApply, message });
                console.error(message);
            }
            handleIsAppliedToTheJob();
        } catch (error) {
            console.error(error);
        }
    }, [job.id]);

    return (
        <>
            {job ? (
                <div
                    // className={`max-lg:fixed max-lg:inset-0 sticky top-4 max-lg:h-screen lg:h-[calc(100vh-2rem)] bg-white lg:border border-gray-200 lg:rounded-xl lg:shadow-sm max-lg:z-999 overflow-auto ${show ? 'max-lg:opacity-100' : 'max-lg:opacity-0 max-lg:pointer-events-none'} duration-200`}
                    className="
                    flex flex-col border border-gray-200 bg-white sticky top-4 lg:max-h-[calc(100vh-2rem)] rounded-lg
                    max-lg:fixed max-lg:z-999 max-lg:inset-0
                    "
                >
                    <div className="lg:hidden">
                        <ModalHeader
                            title="Job Details"
                            onClose={onClose}
                        />
                    </div>

                    <ModalBody>

                        <div className="mb-6">
                            <p className="text-2xl font-bold text-gray-900 leading-snug">{job?.jobTitle}</p>
                            <p className="text-gray-500 text-sm mt-1 mb-3">{job?.company?.companyName}</p>
                            <div className="flex gap-2 flex-wrap items-center">
                                <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full px-3 py-1">{job?.type}</span>
                                <span className="flex gap-1.5 items-center text-xs text-gray-400">
                                    <Clock size={13} /> {formatPostedDate(job?.postedAt)}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shrink-0">
                                    <MapPin size={15} className="text-gray-500" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-gray-400 text-xs">Location</p>
                                    <p className="font-semibold text-sm text-gray-900 truncate">{job?.company?.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shrink-0">
                                    <GraduationCap size={15} className="text-gray-500" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-gray-400 text-xs">Education</p>
                                    <p className="font-semibold text-sm text-gray-900 truncate">{job?.education}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shrink-0">
                                    <Award size={15} className="text-gray-500" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-gray-400 text-xs">Experience</p>
                                    <p className="font-semibold text-sm text-gray-900 truncate">{job?.experience}</p>
                                </div>
                            </div>
                            {job?.payType && (
                                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-sm shrink-0">
                                        <Banknote size={15} className="text-gray-500" />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-gray-400 text-xs">Salary</p>
                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            ₱{formatNumberWithCommas(job?.payMin)} {(job?.payMin !== job?.payMax) && `- ₱${formatNumberWithCommas(job?.payMax)}`} {formatPayType(job?.payType)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm w-fit px-4 py-2 mb-6">
                            <User size={16} />
                            {job?.slot} slot{job?.slot === 1 ? '' : 's'} remaining
                        </div>

                        <p className="text-base font-semibold text-gray-900 mb-3">Job Description</p>
                        <p className="whitespace-pre-line text-sm text-gray-600 leading-relaxed mb-6">{job?.description}</p>

                        {(job?.responsibilities?.length > 0) &&
                            <>
                                <p className="text-base font-semibold text-gray-900 mb-3">Responsibilities</p>
                                <div className="flex flex-col gap-2 mb-6">
                                    {job?.responsibilities.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CircleCheckBig size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                        {(job?.requirements?.length > 0) &&
                            <>
                                <p className="text-base font-semibold text-gray-900 mb-3">Requirements</p>
                                <div className="flex flex-col gap-2 mb-6">
                                    {job?.requirements.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CircleCheckBig size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }
                        {(job?.benefitsAndPerks?.length > 0) &&
                            <>
                                <p className="text-base font-semibold text-gray-900 mb-3">Benefits & Perks</p>
                                <div className="grid grid-cols-2 gap-2 mb-6">
                                    {job?.benefitsAndPerks.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-2.5 rounded-lg">
                                            <CircleCheckBig size={15} className="text-emerald-500 shrink-0" />
                                            <p className="text-sm text-gray-600">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        }

                    </ModalBody>

                    <div className="flex gap-4 p-4 border-t border-gray-300">

                        <button
                            onClick={() => handleSaveJob(job?.id)}
                            className="btn rounded-xl disabled:brightness-50"
                        >
                            <Bookmark
                                size={16}
                                fill={savedJobsList.includes(job?.id) ? "currentColor" : "none"}
                                className="text-amber-500"
                            />
                        </button>

                        <button
                            disabled={!userApplyStatus.success}
                            onClick={handleApply}
                            className="flex-1 btn rounded-xl disabled:brightness-50 text-white bg-emerald-500"
                        >
                            {userApplyStatus.message}
                        </button>

                    </div>

                </div>
            ) : (
                <div
                    className="max-lg:fixed max-lg:inset-0 sticky top-0 h-screen flex-center flex-col gap-4 bg-white border border-dashed border-gray-200 rounded-xl p-8 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none"
                >
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex-center">
                        <Briefcase size={32} className="text-gray-300" strokeWidth={1.5} />
                    </div>

                    <div className="text-center max-w-xs">
                        <p className="text-gray-700 font-medium mb-1">No job selected</p>
                        <p className="text-gray-400 text-sm">
                            Choose a listing from the panel to view its full details here.
                        </p>
                    </div>
                </div>
            )}

            {showApply &&
                <Apply job={job} onClose={() => setShowApply(false)} />
            }
        </>
    )
}