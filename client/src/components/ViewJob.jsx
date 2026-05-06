import { ArrowLeft, Award, Banknote, Bookmark, Briefcase, Building2, CircleCheckBig, Clock, GraduationCap, MapPin, User } from "lucide-react";
import { formatPayType, formatPostedDate } from "../utils/format";
import { useState } from "react";
import Apply from "./Apply";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { applyStatus } from "../services/userServices";

export default function ViewJob({
    job,
    onClose = () => { },
    handleSaveJob = () => { },
    savedJobsList = [],
    show
}) {

    const navigate = useNavigate();

    const { user } = useContext(UserContext);

    const [userApplyStatus, setUserApplyStatus] = useState({ success: true, message: 'Apply' });

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
                <div className={`max-lg:fixed max-lg:inset-0 sticky top-0 h-screen bg-white lg:border-2 border-emerald-500 lg:rounded-xl p-4 max-lg:z-999 overflow-auto ${show ? 'max-lg:opacity-100' : 'max-lg:opacity-0 max-lg:pointer-events-none'} duration-200`}>
                    <button
                        className="lg:hidden flex items-center gap-2 cursor-pointer mb-8"
                        onClick={onClose}
                    >
                        <ArrowLeft className="text-emerald-500" />
                        <p className="font-semibold">Back to jobs</p>
                    </button>

                    <div className="flex gap-4 mb-4">
                        <div className="p-4 rounded-lg bg-gray-200 text-gray-500 h-fit w-fit">
                            <Building2 size={32} className="shrink-0" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{job?.jobTitle}</p>
                            <p className="text-gray-500 mb-4">{job?.company?.companyName}</p>
                            <div className="flex gap-2">
                                <span className="bg-emerald-100 text-emerald-500 rounded-full px-4 py-1 text-sm">{job?.type}</span>
                                <span className="flex gap-2 items-center text-gray-500 text-sm">
                                    <Clock size={16} /> {formatPostedDate(job?.postedAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-wrap items-center mb-8">
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <MapPin size={16} className="text-gray-500 shrink-0" />
                            <div>
                                <p className="text-gray-500 text-xs">Location</p>
                                <p className="text-sm font-semibold">{job?.company?.location}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <GraduationCap size={16} className="text-gray-500 shrink-0" />
                            <div>
                                <p className="text-gray-500 text-xs">Education</p>
                                <p className="text-sm font-semibold">{job?.education}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <Award size={16} className="text-gray-500 shrink-0" />
                            <div>
                                <p className="text-gray-500 text-xs">Experience</p>
                                <p className="text-sm font-semibold">{job?.experience}</p>
                            </div>
                        </div>
                        {job?.payType && (
                            <div className="flex-1 flex items-center gap-2 min-w-50">
                                <Banknote size={16} className="text-gray-500 shrink-0" />
                                <div>
                                    <p className="text-gray-500 text-xs">Salary</p>
                                    <p className="text-sm font-semibold">
                                        ₱{job?.payMin} {(job?.payMin !== job?.payMax) && `- ₱${job?.payMax}`} {formatPayType(job?.payType)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="flex items-center justify-center gap-2 rounded-xl text-emerald-500 font-bold w-fit mb-4">
                        <User />
                        SLOT REMAINING : {job?.slot}
                    </p>

                    <p className="text-xl font-semibold mb-4">Job Description</p>
                    <p className="whitespace-pre-line text-gray-500 mb-8">{job?.description}</p>

                    {(job?.responsibilities?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Responsibilities</p>
                            <div className="flex flex-col gap-2 mb-8">
                                {job?.responsibilities.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    {(job?.requirements?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Requirements</p>
                            <div className="flex flex-col gap-2 mb-8">
                                {job?.requirements.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    {(job?.benefitsAndPerks?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Benefits & Perks</p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {job?.benefitsAndPerks.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    <div className="grid grid-cols-2 gap-4">
                        <button

                            className={`btn rounded-lg bg-emerald-500 ${userApplyStatus.success ? 'bg-emerald-500 text-white' : 'pointer-events-none bg-gray-200'}`}
                            onClick={handleApply}
                        >
                            {userApplyStatus.message}
                        </button>
                        <button
                            className="btn btn-ghost rounded-lg text-yellow-500 outline-2 -outline-offset-2 outline-yellow-500"
                            onClick={() => handleSaveJob(job?.id)}
                        >
                            <Bookmark
                                size={16}
                                className="shrink-0"
                                fill={savedJobsList.includes(job?.id) ? "currentColor" : "none"}
                            />
                            Save Job
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="max-lg:fixed max-lg:inset-0 sticky top-0 h-screen flex-center flex-col bg-white border border-gray-200 rounded-xl p-4 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                    <Briefcase size={64} className="text-gray-200" />
                    <p className="text-gray-500 text-lg">Select a job to see details</p>
                </div>
            )}

            {showApply &&
                <Apply job={job} onClose={() => setShowApply(false)} />
            }
        </>
    )
}