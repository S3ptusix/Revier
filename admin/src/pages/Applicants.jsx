/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, CircleX, Clock, EllipsisVertical, Mail, Phone, CircleCheckBig, UserPlus, UserCheck, UserMinus, Search, Plus, FileText } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import RejectApplicant from "../components/RejectApplicant";
import Blacklist from "../components/Blacklist";;
import ApplicantDetails from "../components/ApplicantDetails";
import ScheduleInteview from "../components/ScheduleInterview";
import RescheduleInteview from "../components/RescheduleInterview";
import AddToEvent from "../components/AddToEvent";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Loading from "../components/Loading";
import TabNew from "../components/TabNew";
import TabInterview from "../components/TabInterview";
import { fetchAllSelectCompany } from "../services/companyServices";
import { useEffect } from "react";
import TabOrientation from "../components/TabOrientation";
import { fetchAllNew } from "../services/newServices";
import { fetchAllInterviews, moveApplicant } from "../services/applicants";
import { fetchAllOrientation } from "../services/orientationsServices";
import ViewEvents from "../components/ViewEvents";
import { toast } from "react-toastify";
import { fetchDashboardTotals } from "../services/dashboardServices";

export default function Applicants() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [totals, setTotals] = useState({
        incommingOrientations: 0,
        pipelineApplicants: 0,
        openPositions: 0,
        closedPositions: 0,
        scheduleForInterview: 0,
        unscheduledInterview: 0,
        scheduleForOrientation: 0,
        unscheduledOrientation: 0,
        totalPerStage: {
            New: 0,
            Interview: 0,
            Orientation: 0
        }
    })

    const [tab, setTab] = useState('New');

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const [applicantId, setApplicantId] = useState(null);
    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [showRejectApplicant, setShowRejectApplicant] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);

    const [viewEvent, setViewEvent] = useState(false);

    const [isScheduled, setIsScheduled] = useState(false);

    const loadTable = async () => {
        switch (tab) {
            case 'New': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllNew({ search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }

            case 'Interview': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllInterviews({ isScheduled, search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }

            case 'Orientation': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllOrientation({ isScheduled, search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }

            default:
                console.error("invalid tab");
        }
    };

    const runFetchAllCompany = async () => {
        const { success, message, companies } = await fetchAllSelectCompany();

        if (success) {
            setSelectCompanies(companies);
        } else {
            console.error(message);
        }
    };

    const handleApplicantDetails = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantDetails(true);
    }

    const handleRejectApplicant = (applicantId) => {
        setApplicantId(applicantId);
        setShowRejectApplicant(true);
    }

    const handleBlacklist = (applicantId) => {
        setApplicantId(applicantId);
        setShowBlacklist(true);
    }

    const handleMoveApplicant = async (applicantId) => {
        try {
            const { success, message } = await moveApplicant(applicantId);
            if (success) {
                loadTable();
                return
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    const loadTotals = async () => {
        try {
            setIsLoading(true);
            const { success, message, totals: apiTotals } = await fetchDashboardTotals();
            if (success) return setTotals(apiTotals);
            console.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }


    const loadAfter = async () => {
        try {
            loadTotals();
            setIsLoading(true);
            runFetchAllCompany();
            loadTable();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAfter();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [tab, toSearch, companyId, isScheduled]);

    useEffect(() => {
        loadTable();
    }, [tab, toSearch, companyId, isScheduled, page]);

    useEffect(() => {
        setSearch('');
        setToSearch('');
        setIsScheduled(false);
    }, [tab]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* applicants header */}
                        <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <p className="text-2xl font-semibold">Applicant Pipeline</p>
                                <p className="text-gray-500">Manage applicants through the recruitment workflow</p>
                            </div>

                            {tab === 'Orientation' && (
                                <button
                                    className="btn rounded-lg bg-emerald-500 text-white"
                                    onClick={() => setViewEvent(true)}
                                >
                                    <Eye size={16} />
                                    <p className="font-semibold text-sm cursor-pointer">View Events</p>
                                </button>
                            )}
                        </section>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: "New", label: "New Application" },
                                { key: "Interview", label: "Interview" },
                                { key: "Orientation", label: "Orientation" }
                            ].map(item => {
                                const isActive = tab === item.key;
                                const count = totals?.totalPerStage?.[item.key] ?? 0;

                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`
                                        flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2
                                        transition-all duration-200 cursor-pointer
                                        ${isActive
                                            ? "bg-white border-emerald-500 text-emerald-600 shadow-sm"
                                            : "bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200"}
                                        `}
                                    >
                                        <FileText size={16} />

                                        <span className="text-sm font-medium">
                                            {item.label}
                                        </span>

                                        <span
                                            className={`
                                                ml-1 px-2 py-0.5 text-xs rounded-full
                                                ${isActive
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-blue-100 text-blue-600"}
                                            `}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <section className="border border-gray-300 p-4 rounded-lg max-w-full mb-8">
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                                <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                    <div className="grow">
                                        <Input
                                            placeholder="Applicant name, email, position, or company..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
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
                            {(tab === "Interview" || tab === "Orientation") && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <button className={`btn rounded-lg ${!isScheduled ? 'bg-emerald-500 text-white' : ''}`}
                                        onClick={() => setIsScheduled(false)}>
                                        Not Scheduled
                                    </button>
                                    <button className={`btn rounded-lg ${isScheduled ? 'bg-emerald-500 text-white' : ''}`}
                                        onClick={() => setIsScheduled(true)}>
                                        Scheduled
                                    </button>
                                </div>
                            )}


                            {
                                tab === 'New' ? (
                                    <TabNew
                                        isLoading={isLoading}
                                        data={data}
                                        pagination={pagination}
                                        page={page}
                                        setPage={setPage}
                                        handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                        handleRejectApplicant={(applicantId) => handleRejectApplicant(applicantId)}
                                        handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                        handleMoveApplicant={(applicantId) => handleMoveApplicant(applicantId)}
                                    />
                                ) :
                                    tab === 'Interview' ? (
                                        <TabInterview
                                            isLoading={isLoading}
                                            data={data}
                                            pagination={pagination}
                                            page={page}
                                            setPage={setPage}
                                            handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                            handleRejectApplicant={(applicantId) => handleRejectApplicant(applicantId)}
                                            handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                            loadAfter={loadTable}
                                        />
                                    ) :
                                        tab === 'Orientation' ? (
                                            <TabOrientation
                                                isLoading={isLoading}
                                                data={data}
                                                pagination={pagination}
                                                page={page}
                                                setPage={setPage}
                                                handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                                handleRejectApplicant={(applicantId) => handleRejectApplicant(applicantId)}
                                                handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                                loadAfter={loadTable}
                                            />
                                        ) : (
                                            <div>
                                                Can't find tab
                                            </div>
                                        )
                            }
                        </section>
                    </div>
                )}
            </div>

            {viewEvent && (
                <ViewEvents
                    onClose={() => setViewEvent(false)}
                />
            )}

            {showApplicantDetails && (
                <ApplicantDetails
                    applicantId={applicantId}
                    onClose={() => setShowApplicantDetails(false)}
                />
            )}

            {showRejectApplicant && (
                <RejectApplicant
                    applicantId={applicantId}
                    onClose={() => setShowRejectApplicant(false)}
                    loadAfter={loadTable}
                />
            )}

            {showBlacklist && (
                <Blacklist
                    applicantId={applicantId}
                    onClose={() => setShowBlacklist(false)}
                    loadAfter={loadTable}
                />
            )}
        </div>
    )
}