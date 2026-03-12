import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Calendar, CircleCheckBig, CircleX, EllipsisVertical, MapPin, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchAllInterviews } from "../services/applicants";
import { useEffect } from "react";
import { useState } from "react";
import ScheduleInteview from "../components/ScheduleInterview";
import { cleanDateTime } from "../utils/format";
import InterviewResult from "../components/InterviewResult";

export default function Interviews() {

    const [data, setData] = useState([]);

    const [applicantId, setApplicantId] = useState(null);

    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [showInterviewResult, setShowInterviewResult] = useState(false);

    const handleScheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowScheduleInterview(true);
    }

    const handleInterviewResult = (applicantId) => {
        setApplicantId(applicantId);
        setShowInterviewResult(true);
    }

    const loadTable = async () => {
        const { success, message, applicants } = await fetchAllInterviews();
        if (success) return setData(applicants);
        console.error(message);
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTable();
            })
        } catch (error) {
            console.error(error);
        }
    }, []);

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
                            <p className="font-bold text-2xl">3</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Passed</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Failed</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total</p>
                                <User size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">5</p>
                        </div>
                    </section>

                    {/* admin table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <p className="font-semibold grow">Interview Candidates</p>

                            <select
                                name="industry"
                                className="select grow"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending Interview">Pending Interview</option>
                                <option value="Passed Interview">Passed Interview</option>
                                <option value="Failed Interview">Failed Interview</option>
                            </select>
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
                                                            <p className="flex gap-2 items-center"> <MapPin size={12} />{applicant?.interviewLocation}</p>
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
                                                                <DropdownMenu.Item>
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

                                                            {(applicant?.interviewStatus === 'Pending' && applicant?.interviewAt !== null) &&
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
                    loadTable={loadTable}
                />
            }

            {showInterviewResult &&
                <InterviewResult
                    applicantId={applicantId}
                    onClose={() => setShowInterviewResult(false)}
                    loadTable={loadTable}
                />
            }
        </div>
    )
}