/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import { Ban, Building2, Eye, Users, ArrowRight, Calendar, CalendarClock, CalendarCheck, CircleX, Clock, EllipsisVertical, Mail, Phone, CircleCheckBig, UserPlus, UserCheck, UserMinus, Search, Plus, FileText } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import RejectApplicant from "../components/RejectApplicant";
import Blacklist from "../components/Blacklist";
import ApplicantDetails from "../components/ApplicantDetails";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Loading from "../components/Loading";
import TabNew from "../components/TabNew";
import TabInterview from "../components/TabInterview";
import { fetchAllSelectCompany } from "../services/companyServices";
import { useEffect } from "react";
import TabOrientation from "../components/TabOrientation";
import { fetchAllNew } from "../services/newServices";
import { fetchApplicantTotals } from "../services/applicantServices";
import { fetchAllOrientation } from "../services/orientationsServices";
import OrientationEvents from "../components/OrientationEvents";
import { fetchAllInterviews } from "../services/interviewServices";
export default function Applicants() {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [totals, setTotals] = useState({
    })

    const [tab, setTab] = useState('new');

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const [applicantId, setApplicantId] = useState(null);
    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [showRejectApplicant, setShowRejectApplicant] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);

    const [viewEvent, setViewEvent] = useState(false);

    const loadTable = async () => {
        switch (tab) {
            case 'new': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllNew({ search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }
            case 'scheduledForInterview': {
                const { success, message, applicants, pagination: apiPagination } = await fetchAllInterviews({ search, companyId, page });

                if (success) {
                    setData(applicants);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
                break;
            }

            case 'scheduledForOrientation': {
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

    const loadTotals = async () => {
        try {
            const { success, message, data: apiTotals } = await fetchApplicantTotals({ search, companyId });
            if (success) return setTotals(apiTotals);
            console.error(message);
        } catch (error) {
            console.error(error);
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
    }, [tab, toSearch, companyId]);

    useEffect(() => {
        loadTable();
        loadTotals();
    }, [tab, toSearch, companyId, page]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* applicants header */}
                        <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <p className="text-2xl font-semibold">Applicant Pipeline</p>
                                <p className="text-gray-500">{totals?.totalApplicants || 0} total candidates in pipeline</p>
                            </div>

                            {(tab === 'orientation' || tab === 'scheduledForOrientation') && (
                                <button
                                    className="btn rounded-lg bg-emerald-500 text-white"
                                    onClick={() => setViewEvent(true)}
                                >
                                    <Eye size={16} />
                                    <p className="font-semibold text-sm cursor-pointer">View Events</p>
                                </button>
                            )}
                        </section>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
                            <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                <div className="grow">
                                    <Input
                                        placeholder="Search Applicant"
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

                        <div className="flex gap-1 overflow-x-auto border-b border-gray-200 scrollbar-none">
                            {[
                                { key: "new", label: "New Application", icon: FileText },
                                { key: "scheduledForInterview", label: "Scheduled for Interview", icon: CalendarClock },
                                { key: "scheduledForOrientation", label: "Scheduled for Orientation", icon: CalendarCheck },
                            ].map(item => {
                                const isActive = tab === item.key;
                                const count = totals?.[item.key] ?? 0;
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setTab(item.key)}
                                        className={`
                    relative flex items-center gap-2 px-4 py-2.5 whitespace-nowrap
                    text-sm font-medium transition-colors duration-150 cursor-pointer
                    ${isActive
                                                ? "text-emerald-600"
                                                : "text-gray-500 hover:text-gray-800"}
                `}
                                    >
                                        <Icon size={16} className={isActive ? "text-emerald-600" : "text-gray-400"} />

                                        <span>{item.label}</span>

                                        <span
                                            className={`
                        px-1.5 py-0.5 text-xs font-semibold rounded-full min-w-5 text-center
                        transition-colors duration-150
                        ${isActive
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-gray-100 text-gray-500"}
                    `}
                                        >
                                            {count}
                                        </span>

                                        {/* active underline — absolutely positioned so it doesn't shift layout */}
                                        <span
                                            className={`
                        absolute left-0 right-0 -bottom-px h-0.5 rounded-full
                        transition-opacity duration-150
                        ${isActive ? "bg-emerald-500 opacity-100" : "opacity-0"}
                    `}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        <section>
                            {
                                tab === 'new' ? (
                                    <TabNew
                                        isLoading={isLoading}
                                        data={data}
                                        pagination={pagination}
                                        page={page}
                                        setPage={setPage}
                                        handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                        handleRejectApplicant={(applicantId) => handleRejectApplicant(applicantId)}
                                        handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                        loadAfter={loadAfter}
                                    />
                                ) :
                                    tab === 'scheduledForInterview' ? (
                                        <TabInterview
                                            isLoading={isLoading}
                                            data={data}
                                            pagination={pagination}
                                            page={page}
                                            setPage={setPage}
                                            handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                            handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                            loadAfter={loadAfter}
                                        />
                                    ) : tab === 'scheduledForOrientation' ? (
                                        <TabOrientation
                                            isLoading={isLoading}
                                            data={data}
                                            pagination={pagination}
                                            page={page}
                                            setPage={setPage}
                                            handleApplicantDetails={(applicantId) => handleApplicantDetails(applicantId)}
                                            handleBlacklist={(applicantId) => handleBlacklist(applicantId)}
                                            loadAfter={loadAfter}
                                        />
                                    ) :
                                        (
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
                <OrientationEvents
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
                    loadAfter={loadAfter}
                />
            )}

            {showBlacklist && (
                <Blacklist
                    applicantId={applicantId}
                    onClose={() => setShowBlacklist(false)}
                    loadAfter={loadAfter}
                />
            )}
        </div>
    )
}