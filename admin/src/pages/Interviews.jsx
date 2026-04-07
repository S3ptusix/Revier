/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Ban, Calendar, CircleCheckBig, CircleX, EllipsisVertical, MapPin, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchAllInterviews, fetchInterviewTotals } from "../services/applicants";
import { useEffect } from "react";
import { useState } from "react";
import ScheduleInteview from "../components/ScheduleInterview";
import { cleanDateTime } from "../utils/format";
import InterviewResult from "../components/InterviewResult";
import RescheduleInteview from "../components/RescheduleInterview";
import Select from "../components/ui/Select";

export default function Interviews() {

    const [interviewStatus, setInterviewstatus] = useState('');
    const [totals, setTotals] = useState({
        totalInterviewed: 0,
        pendingInterviews: 0,
        passed: 0,
        failed: 0
    });
    const [data, setData] = useState([]);

    const [applicantId, setApplicantId] = useState(null);

    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [showRescheduleInterview, setShowRescheduleInterview] = useState(false);
    const [showInterviewResult, setShowInterviewResult] = useState(false);

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

    const loadTotals = async () => {
        const { success, message, totals } = await fetchInterviewTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, applicants } = await fetchAllInterviews({ interviewStatus });
        if (success) return setData(applicants);
        console.error(message);
    }

    const loadAfter = () => {
        loadTotals();
        loadTable();
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadAfter();
            })
        } catch (error) {
            console.error(error);
        }
    }, [interviewStatus]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* interviews header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Interview Management</p>
                            <p className="text-gray-500">Schedule and track candidate interviews</p>
                        </div>
                    </section>

                    {/* interviews totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Pending Interviews</p>
                                <Calendar size={16} className="text-blue-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.pendingInterviews}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Interviewed</p>
                                <User size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.totalInterviewed}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Passed</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.passed}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Failed</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.failed}</p>
                        </div>
                    </section>

                    {/* admin table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <p className="font-semibold grow">Interview Candidates</p>

                            <div className="w-75">
                                <Select
                                    placeholder='All Status'
                                    options={[
                                        { value: 'Pending', name: 'Pending' },
                                        { value: 'Passed', name: 'Passed' },
                                        { value: 'Failed', name: 'Failed' }
                                    ]}
                                    value={interviewStatus}
                                    onChange={(e) => setInterviewstatus(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Interview Details</th>
                                        <th>Status</th>
                                        <th className="action-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(applicant => (
                                        <tr key={applicant?.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="profile-logo h-10 w-10">{applicant?.fullname[0]}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold">{applicant?.fullname}</p>
                                                        <p className="text-sm text-gray-500">{applicant?.user?.email}</p>
                                                        {applicant?.user?.applicants?.length > 0 &&
                                                            <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md w-min">
                                                                <Ban size={16} />
                                                                Blacklisted
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{applicant?.job?.jobTitle}</p>
                                            </td>
                                            <td>
                                                <p>{applicant?.job?.company?.companyName}</p>
                                            </td>
                                            <td>
                                                {applicant?.interviewAt ?
                                                    (
                                                        <>
                                                            <p className="flex gap-2 items-center"> <Calendar size={12} />{cleanDateTime(applicant?.interviewAt)}</p>
                                                            {applicant?.interviewLocation && <p className="flex gap-2 items-center"> <MapPin size={12} />{applicant?.interviewLocation}</p>}
                                                        </>
                                                    ) :
                                                    (<p className="text-gray-500">Not scheduled</p>)
                                                }
                                            </td>
                                            <td>
                                                <p className={` status-style text-white ${applicant?.interviewStatus === 'Pending' ? 'bg-blue-500' : applicant?.interviewStatus === 'Passed' ? 'bg-emerald-500' : 'bg-red-500'}`}>{applicant?.interviewStatus}</p>
                                            </td>
                                            <td>
                                                <div className="relative flex-center">
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger className="btn btn-square btn-ghost border-none hover:bg-gray-200 rounded-lg outline-0">
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
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

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
        </div>
    )
}