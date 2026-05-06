/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Sidemenu from "../components/Sidemenu";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, CircleX, Clock, EllipsisVertical, Mail, Phone, CircleCheckBig, UserPlus, UserCheck, UserMinus, Search, Plus } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import RejectApplicant from "../components/RejectApplicant";
import Blacklist from "../components/Blacklist";;
import ApplicantDetails from "../components/ApplicantDetails";
import ScheduleInteview from "../components/ScheduleInterview";
import RescheduleInteview from "../components/RescheduleInterview";
import InterviewResult from "../components/InterviewResult";
import AddToEvent from "../components/AddToEvent";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Loading from "../components/Loading";
import TabNew from "../components/TabNew";
import TabInterview from "../components/TabInterview";
import { fetchAllSelectCompany } from "../services/companyServices";
import { useEffect } from "react";
import TabOrientation from "../components/TabOrientation";
import AddEvent from "../components/AddEvent";
import { fetchAllNew } from "../services/newServices";
import { fetchAllInterviews, moveApplicant } from "../services/applicants";
import { fetchAllOrientation } from "../services/orientationsServices";
import ViewEvents from "../components/viewEvents";
import { toast } from "react-toastify";

export default function Applicants() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

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
                const { success, message, applicants, pagination: apiPagination } = await fetchAllInterviews({ search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }

            case 'Orientation': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllOrientation({ search, companyId, page });

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
    const [openCreateEvent, setOpenCreateEvent] = useState(false);

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

    const loadAfter = async () => {
        try {
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
    }, [tab, search, companyId]);

    useEffect(() => {
        loadTable();
    }, [tab, search, companyId, page]);

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
                                <div className="flex gap-4">
                                    <button
                                        className="btn rounded-lg"
                                        onClick={() => setViewEvent(true)}
                                    >
                                        <Eye size={16} />
                                        <p className="font-semibold text-sm cursor-pointer">View Events</p>
                                    </button>
                                    <button
                                        className="btn bg-emerald-500 text-white rounded-lg"
                                        onClick={() => setOpenCreateEvent(true)}
                                    >
                                        <Plus size={16} />
                                        <p className="font-semibold text-sm cursor-pointer">Create Event</p>
                                    </button>
                                </div>
                            )}
                        </section>

                        <div className="flex mb-8 bg-gray-300 space-x-0.5 w-fit">
                            <button
                                className={`bg-white cursor-pointer px-2 ${tab === 'New' ? 'text-emerald-500 underline' : ''}`}
                                onClick={() => setTab('New')}
                            >
                                New Application
                            </button>
                            <button
                                className={`bg-white cursor-pointer px-2 ${tab === 'Interview' ? 'text-emerald-500 underline' : ''}`}
                                onClick={() => setTab('Interview')}
                            >
                                Interview
                            </button>
                            <button
                                className={`bg-white cursor-pointer px-2 ${tab === 'Orientation' ? 'text-emerald-500 underline' : ''}`}
                                onClick={() => setTab('Orientation')}
                            >
                                Orientation
                            </button>
                        </div>

                        <section className="border border-gray-300 p-4 rounded-lg max-w-full mb-8">
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                                <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                    <div className="grow">
                                        <Input
                                            placeholder="Search by name, email, position, or company..."
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
            {openCreateEvent && (
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                />
            )}

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