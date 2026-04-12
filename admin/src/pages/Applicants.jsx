/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, CircleX, Clock, EllipsisVertical, Mail, Phone, CircleCheckBig, UserPlus, UserCheck, UserMinus, Search } from "lucide-react";
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
import Select from "../components/ui/Select";
import { fetchAllSelectCompany } from "../services/companyServices";
import Input from "../components/ui/Input";
import Loading from "../components/Loading";

export default function Applicants() {

    const [isLoading, setIsLoading] = useState(false);

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

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

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

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

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
        const { success, message, pipeline } = await fetchApplicantsPipeline({ search: toSearch, companyId });
        if (success) return setData(pipeline);
        console.error(message);
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchApplicantTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const runFetchAllCompany = async () => {
        const { success, message, companies } = await fetchAllSelectCompany();

        if (success) {
            setSelectCompanies(companies);
        } else {
            console.error(message);
        }
    };

    const loadAfter = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                loadTotals(),
                loadPipeline()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

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
        loadAfter();
        runFetchAllCompany();
    }, []);

    useEffect(() => {
        loadPipeline();
    }, [toSearch, companyId]);

    if (isLoading) return <Loading />

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 grow">

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

                    <section className="border border-gray-300 p-4 rounded-lg max-w-full mb-8">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                            <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                <Input
                                    placeholder="Search by name, email, position, or company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-ghost rounded-lg"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                </button>
                            </div>
                            <Select
                                placeholder="All Companies"
                                options={selectCompanies?.map(company => ({ value: company.id, name: company.companyName }))}
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="flex gap-4 overflow-auto max-h-[calc(100vh-4rem)]">

                        {/* NEW */}
                        <div className="relative flex-1 bg-gray-100 rounded-xl min-w-75 px-4 overflow-auto border border-gray-300">
                            <div className="backdrop-blur-lg bg-gray-100/50 z-10 sticky py-4 top-0 left-0 right-0 flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                                <p className="font-semibold text-lg">New</p>
                            </div>
                            {data?.new?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2 mb-4">
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
                        <div className="relative flex-1 bg-gray-100 rounded-xl min-w-75 px-4 overflow-auto border border-gray-300">
                            <div className="backdrop-blur-lg bg-gray-100/50 z-10 sticky py-4 top-0 left-0 right-0 flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                                <p className="font-semibold text-lg">Interview</p>
                            </div>
                            {data?.interview?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2 mb-4">
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
                        <div className="relative flex-1 bg-gray-100 rounded-xl min-w-75 px-4 overflow-auto border border-gray-300">
                            <div className="backdrop-blur-lg bg-gray-100/50 z-10 sticky py-4 top-0 left-0 right-0 flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full bg-purple-500"></div>
                                <p className="font-semibold text-lg">Orientation</p>
                            </div>
                            {data?.orientation?.map(applicant => (
                                <div key={applicant?.id} className="relative bg-white p-4 rounded-lg space-y-2 mb-4">
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
                                                {applicant?.orientationEvent ? 'Change Event' : 'Add to Event'}
                                            </DropdownMenu.Item>
                                            {applicant?.orientationEvent && (
                                                <>
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
                                                </>
                                            )}

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