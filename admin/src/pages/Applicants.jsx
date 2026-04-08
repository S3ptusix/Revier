/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, CircleX, Clock, EllipsisVertical, Mail, Phone, CircleCheckBig, UserPlus, UserCheck, UserMinus } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useEffect } from "react";
import { fetchApplicantsPipeline, fetchApplicantTotals, moveApplicant } from "../services/applicants";
import RejectApplicant from "../components/RejectApplicant";
import ApplicantStatusHistory from "../components/ApplicantStatusHistory";
import { cleanDateTime } from "../utils/format";
import Blacklist from "../components/Blacklist";
import { toast } from "react-toastify";
import ApplicantDetails from "../components/ApplicantDetails";
import ScheduleInteview from "../components/ScheduleInterview";
import RescheduleInteview from "../components/RescheduleInterview";
import InterviewResult from "../components/InterviewResult";
import AddToEvent from "../components/AddToEvent";
import { editOrientationStatus } from "../services/orientationsServices";

export default function Applicants() {

    const [applicantId, setApplicantId] = useState(null);
    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [showRejectApplicant, setShowRejectApplicant] = useState(false);
    const [showApplicantStatusHistory, setShowApplicantStatusHistory] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);

    const [data, setData] = useState({
        new: [],
        interview: [],
        orientation: []
    })
    const [totals, setTotals] = useState({
        totalApplicants: 0,
        inProcess: 0,
        hired: 0,
        rejected: 0
    })

    const handleApplicantDetails = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantDetails(true);
    }

    const handleRejectApplicant = (applicantId) => {
        setApplicantId(applicantId);
        setShowRejectApplicant(true);
    }

    const handleApplicantStatusHistory = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantStatusHistory(true);
    }

    const handleBlacklist = (applicantId) => {
        setApplicantId(applicantId);
        setShowBlacklist(true);
    }


    // Interview
    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [showRescheduleInterview, setShowRescheduleInterview] = useState(false);
    const [showInterviewResult, setShowInterviewResult] = useState(false);

    // Orientation
    const [openAddToEvent, setOpenAddToEvent] = useState(false);

    const handleAddToEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenAddToEvent(true);
    }

    const handleOrientationResult = async (applicantId, orientationStatus) => {
        try {
            const { success, message } = await editOrientationStatus(applicantId, { orientationStatus });
            if (success) {
                loadAfter();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleScheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowScheduleInterview(true);
    }

    const handleRescheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowRescheduleInterview(true);
    }

    const handleInterviewResult = (applicantId) => {
        setApplicantId(applicantId);
        setShowInterviewResult(true);
    }

    const loadPipeline = async () => {
        const { success, message, pipeline } = await fetchApplicantsPipeline();
        if (success) return setData(pipeline);
        console.error(message);
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchApplicantTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadAfter = () => {
        loadTotals();
        loadPipeline();
    }

    const handleMoveApplicant = async (applicantId, applicantStatus) => {
        try {
            const { success, message } = await moveApplicant(applicantId, { applicantStatus });
            if (success) {
                loadAfter();
                return
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadAfter();
            })
        } catch (error) {
            console.error(error);
        }
    }, [])

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* applicants header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Applicant Pipeline</p>
                            <p className="text-gray-500">Manage applicants through the recruitment workflow</p>
                        </div>
                    </section>

                    {/* applicants totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applicants</p>
                                <Users size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.totalApplicants}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">In Process</p>
                                <ArrowRight size={16} className="text-blue-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.inProcess}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Hired</p>
                                <Ban size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.hired}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Rejected</p>
                                <Ban size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.rejected}</p>
                        </div>
                    </section>

                    <section className="flex gap-4 overflow-auto max-h-200">

                        {/* NEW */}
                        <div className="flex-1 bg-gray-100 rounded-xl min-w-75 p-4 space-y-4 overflow-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                <p className="font-semibold text-lg">New</p>
                            </div>
                            {data?.new?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className="absolute top-4 right-4 cursor-pointer">
                                            <EllipsisVertical size={16} />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            align="end"
                                            className="minimenu"
                                        >
                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantDetails(applicant?.id)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>
                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                            <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'Interview')}
                                            >
                                                <ArrowRight size={16} />
                                                Move to Interview
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantStatusHistory(applicant?.id)}
                                            >
                                                <Clock size={16} />
                                                View History
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleRejectApplicant(applicant?.id)}
                                            >
                                                <CircleX size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleBlacklist(applicant?.id)}
                                            >
                                                <Ban size={16} />
                                                Blacklist
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                    <div className="flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-emerald-500 text-white flex-center rounded-full">
                                            {applicant?.fullname[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{applicant?.fullname}</p>
                                            <p className="text-sm">{applicant?.job?.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Building2 size={16} className="shrink-0" /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} className="shrink-0" /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} className="shrink-0" />  {applicant?.phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {applicant?.user?.applicants?.length > 0 &&
                                            <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md">
                                                <Ban size={16} />
                                                Blacklisted
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* INTERVIEW */}
                        <div className="flex-1 bg-gray-100 rounded-xl min-w-75 p-4 space-y-4 overflow-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                                <p className="font-semibold text-lg">Interview</p>
                            </div>
                            {data?.interview?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className="absolute top-4 right-4 cursor-pointer">
                                            <EllipsisVertical size={16} />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            align="end"
                                            className="minimenu"
                                        >
                                            {applicant?.interviewAt ? (
                                                <DropdownMenu.Item
                                                    onClick={() => handleRescheduleInterview(applicant?.id)}
                                                >
                                                    <Calendar size={16} />
                                                    Reschedule Interview
                                                </DropdownMenu.Item>
                                            ) : (
                                                <DropdownMenu.Item
                                                    onClick={() => handleScheduleInterview(applicant?.id)}
                                                >
                                                    <Calendar size={16} />
                                                    Schedule Interview
                                                </DropdownMenu.Item>
                                            )}

                                            {applicant?.interviewAt !== null &&
                                                <DropdownMenu.Item
                                                    onClick={() => handleInterviewResult(applicant?.id)}
                                                >
                                                    <CircleCheckBig size={16} />
                                                    Update Result
                                                </DropdownMenu.Item>
                                            }

                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />

                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantDetails(applicant?.id)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>
                                            {/* <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'Orientation')}
                                            >
                                                <ArrowRight size={16} />
                                                Move to Orientation
                                            </DropdownMenu.Item> */}
                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantStatusHistory(applicant?.id)}
                                            >
                                                <Clock size={16} />
                                                View History
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleRejectApplicant(applicant?.id)}
                                            >
                                                <CircleX size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleBlacklist(applicant?.id)}
                                            >
                                                <Ban size={16} />
                                                Blacklist
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                    <div className="flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-emerald-500 text-white flex-center rounded-full">
                                            {applicant?.fullname[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{applicant?.fullname}</p>
                                            <p className="text-sm">{applicant?.job?.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Building2 size={16} className="shrink-0" /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} className="shrink-0" /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} className="shrink-0" />  {applicant?.phone}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {applicant?.user?.applicants?.length > 0 &&
                                            <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md">
                                                <Ban size={16} />
                                                Blacklisted
                                            </div>
                                        }
                                        <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                            <Clock size={16} />
                                            {applicant?.interviewStatus}
                                        </div>
                                        {applicant?.interviewAt &&
                                            <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                                <Calendar size={16} />
                                                {cleanDateTime(applicant?.interviewAt)}
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ORIENTATION */}
                        <div className="flex-1 bg-gray-100 rounded-xl min-w-75 p-4 space-y-4 overflow-auto">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                                <p className="font-semibold text-lg">Orientation</p>
                            </div>
                            {data?.orientation?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2">
                                    <DropdownMenu.Root>
                                        <DropdownMenu.Trigger className="absolute top-4 right-4 cursor-pointer">
                                            <EllipsisVertical size={16} />
                                        </DropdownMenu.Trigger>

                                        <DropdownMenu.Content
                                            align="end"
                                            className="minimenu"
                                        >

                                            <DropdownMenu.Item
                                                onClick={() => handleAddToEvent(applicant?.id)}
                                            >
                                                <UserPlus size={16} />
                                                Add to Event
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleOrientationResult(applicant?.id, 'Present')}
                                                className="text-emerald-500"
                                            >
                                                <UserCheck size={16} />
                                                Present
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleOrientationResult(applicant?.id, 'Absent')}
                                                className="text-red-500"
                                            >
                                                <UserMinus size={16} />
                                                Absent
                                            </DropdownMenu.Item>

                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />

                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantDetails(applicant?.id)}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>

                                            {/* <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'Hired')}
                                            >
                                                <ArrowRight size={16} />
                                                Move to Hired
                                            </DropdownMenu.Item> */}
                                            <DropdownMenu.Item
                                                onClick={() => handleApplicantStatusHistory(applicant?.id)}
                                            >
                                                <Clock size={16} />
                                                View History
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleRejectApplicant(applicant?.id)}
                                            >
                                                <CircleX size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                onClick={() => handleBlacklist(applicant?.id)}
                                            >
                                                <Ban size={16} />
                                                Blacklist
                                            </DropdownMenu.Item>
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Root>
                                    <div className="flex gap-3 items-center">
                                        <div className="h-10 w-10 bg-emerald-500 text-white flex-center rounded-full">
                                            {applicant?.fullname[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{applicant?.fullname}</p>
                                            <p className="text-sm">{applicant?.job?.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Building2 size={16} className="shrink-0" /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} className="shrink-0" /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} className="shrink-0" />  {applicant?.phone}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {applicant?.user?.applicants?.length > 0 &&
                                            <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md">
                                                <Ban size={16} />
                                                Blacklisted
                                            </div>
                                        }
                                        <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                            <Clock size={16} />
                                            {applicant?.orientationStatus}
                                        </div>
                                        {applicant?.orientationEvent?.eventAt &&
                                            <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                                <Calendar size={16} />
                                                {cleanDateTime(applicant?.orientationEvent?.eventAt)}
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {showApplicantDetails &&
                <ApplicantDetails
                    applicantId={applicantId}
                    onClose={() => setShowApplicantDetails(false)}
                />
            }
            {showRejectApplicant &&
                <RejectApplicant
                    applicantId={applicantId}
                    onClose={() => setShowRejectApplicant(false)}
                    loadAfter={loadAfter}
                />
            }
            {showApplicantStatusHistory &&
                <ApplicantStatusHistory
                    applicantId={applicantId}
                    onClose={() => setShowApplicantStatusHistory(false)}
                />
            }
            {showBlacklist &&
                <Blacklist
                    applicantId={applicantId}
                    onClose={() => setShowBlacklist(false)}
                    loadAfter={loadAfter}
                />
            }

            {/* Interview */}
            {showScheduleInterview &&
                <ScheduleInteview
                    applicantId={applicantId}
                    onClose={() => setShowScheduleInterview(false)}
                    loadAfter={loadAfter}
                />
            }

            {showRescheduleInterview &&
                <RescheduleInteview
                    applicantId={applicantId}
                    onClose={() => setShowRescheduleInterview(false)}
                    loadAfter={loadAfter}
                />
            }

            {showInterviewResult &&
                <InterviewResult
                    applicantId={applicantId}
                    onClose={() => setShowInterviewResult(false)}
                    loadAfter={loadAfter}
                />
            }

            {/* Orientation */}
            {openAddToEvent &&
                <AddToEvent
                    applicantId={applicantId}
                    onClose={() => setOpenAddToEvent(false)}
                    loadAfter={loadAfter}
                />
            }

        </div>
    )
}