/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Ban, Calendar, CircleCheckBig, CircleX, EllipsisVertical, MapPin, Search, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchAllInterviews, fetchInterviewTotals } from "../services/applicants";
import { useEffect } from "react";
import { useState } from "react";
import ScheduleInteview from "../components/ScheduleInterview";
import { cleanDateTime } from "../utils/format";
import InterviewResult from "../components/InterviewResult";
import RescheduleInteview from "../components/RescheduleInterview";
import Select from "../components/ui/Select";
import Pagination from "../components/Pagination";
import { fetchAllSelectCompany } from "../services/companyServices";
import Input from "../components/ui/Input";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";

export default function Interviews() {

    const [isLoading, setIsLoading] = useState(false);

    const [totals, setTotals] = useState({
        totalInterviewed: 0,
        pendingInterviews: 0,
        passed: 0,
        failed: 0
    });
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    })

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [applicantId, setApplicantId] = useState(null);

    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [showRescheduleInterview, setShowRescheduleInterview] = useState(false);
    const [showInterviewResult, setShowInterviewResult] = useState(false);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

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
        const { success, message, applicants, pagination: apiPagination } = await fetchAllInterviews({
            search: toSearch,
            companyId,
            page
        });
        if (success) {
            setData(applicants);
            setPagination(apiPagination);
            return;
        }
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
                loadTable()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAfter();
        runFetchAllCompany();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [toSearch, companyId]);

    useEffect(() => {
        loadTable();
    }, [toSearch, companyId, page]);

    if (isLoading) return <Loading />

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

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
                            <div className="flex bg-gray-100 rounded-lg">
                                <Input
                                    placeholder="Search by name, email, position, or company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-ghost rounded-r-lg"
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

                        {data.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Position</th>
                                            <th>Company</th>
                                            <th>Interview Details</th>
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
                        ) : (
                            <div className="rounded-lg overflow-hidden">
                                <NoData message="NO APPLICANT FOUND" />
                            </div>
                        )}
                        <div className="mt-4">
                            <Pagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
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