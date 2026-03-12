import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, Clock, EllipsisVertical, Mail, Pen, Phone, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import EditApplicantStatus from "../components/EditApplicantStatus";
import { useEffect } from "react";
import { fetchApplicantsPipeline } from "../services/applicants";
import RejectApplicant from "../components/RejectApplicant";
import ApplicantStatusHistory from "../components/ApplicantStatusHistory";
import { cleanDateTime } from "../utils/format";

export default function Applicants() {

    const [applicantId, setApplicantId] = useState(null);
    const [applicantStatus, setApplicantStatus] = useState(null);

    const [showMoveApplicant, setShowMoveApplicant] = useState(false);
    const [showRejectApplicant, setShowRejectApplicant] = useState(false);
    const [showApplicantStatusHistory, setShowApplicantStatusHistory] = useState(false);

    const [data, setData] = useState({
        new: [],
        interview: [],
        orientation: []
    })

    const handleMoveApplicant = (applicantId, applicantStatus) => {
        setApplicantId(applicantId);
        setApplicantStatus(applicantStatus);
        setShowMoveApplicant(true);
    }

    const handleRejectApplicant = (applicantId) => {
        setApplicantId(applicantId);
        setShowRejectApplicant(true);
    }

    const handleApplicantStatusHistory = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantStatusHistory(true);
    }

    const loadPipeline = async () => {
        const { success, message, pipeline } = await fetchApplicantsPipeline();
        if (success) return setData(pipeline);
        console.error(message);
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadPipeline();
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
                            <p className="font-bold text-2xl">7</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">In Process</p>
                                <ArrowRight size={16} className="text-blue-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">5</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Hired</p>
                                <Ban size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Rejected</p>
                                <Ban size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
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
                                            <DropdownMenu.Item>
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>
                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                            <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'New')}
                                            >
                                                <Pen size={16} />
                                                Move
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
                                                <Trash2 size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item>
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
                                        <Building2 size={16} /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} />  {applicant?.phone}
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
                                            <DropdownMenu.Item>
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>
                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                            <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'Interview')}
                                            >
                                                <Pen size={16} />
                                                Move
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
                                                <Trash2 size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item>
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
                                        <Building2 size={16} /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} />  {applicant?.phone}
                                    </div>

                                    <div className="flex items-center gap-2">
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
                                            <DropdownMenu.Item>
                                                <Eye size={16} />
                                                View Details
                                            </DropdownMenu.Item>
                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                            <DropdownMenu.Item
                                                onClick={() => handleMoveApplicant(applicant?.id, 'Orientation')}
                                            >
                                                <Pen size={16} />
                                                Move
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
                                                <Trash2 size={16} />
                                                rejected
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item>
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
                                        <Building2 size={16} /> {applicant?.job?.company?.companyName}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Mail size={16} /> {applicant?.user?.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <Phone size={16} />  {applicant?.phone}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                            <Clock size={16} />
                                            {applicant?.orientationStatus}
                                        </div>
                                        {applicant?.orientationAt &&
                                            <div className="flex gap-2 items-center border border-gray-300 py-1 px-2 font-semibold text-xs rounded-md">
                                                <Calendar size={16} />
                                                {cleanDateTime(applicant?.orientationAt)}
                                            </div>
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {showMoveApplicant &&
                <EditApplicantStatus
                    applicantId={applicantId}
                    applicantStatus={applicantStatus}
                    onClose={() => setShowMoveApplicant(false)}
                    loadPipeline={loadPipeline}
                />
            }

            {showRejectApplicant &&
                <RejectApplicant
                    applicantId={applicantId}
                    onClose={() => setShowRejectApplicant(false)}
                    loadPipeline={loadPipeline}
                />
            }
            {showApplicantStatusHistory &&
                <ApplicantStatusHistory
                    applicantId={applicantId}
                    onClose={() => setShowApplicantStatusHistory(false)}
                />
            }
        </div>
    )
}