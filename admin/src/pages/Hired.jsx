/* eslint-disable react-hooks/exhaustive-deps */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Ban, Building2, Calendar, EllipsisVertical, Eye, MapPin, Search, UserCheck } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import { useState } from "react";
import { cleanDateTime } from "../utils/format";
import { fetchAllHired, fetchHiredTotals } from "../services/hiredServices";
import Input from "../components/ui/Input";
import Blacklist from "../components/Blacklist";
import ApplicantDetails from "../components/ApplicantDetails";
import Pagination from "../components/Pagination";
import { fetchAllSelectCompany } from "../services/companyServices";
import Select from "../components/ui/Select";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";
import EmployeeLeft from "../components/EmployeeLeft";

export default function Hired() {

    const [isLoading, setIsLoading] = useState(false);

    const [toSearch, setToSearch] = useState('');
    const [search, setSearch] = useState('');

    const [totals, setTotals] = useState({
        totalHired: 0,
        thisMonth: 0,
        companies: 0,
        position: 0
    });
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });


    const [applicantId, setApplicantId] = useState(null);
    const [showApplicantDetails, setShowApplicantDetails] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const [showEmployeeLeft, setShowEmployeeLeft] = useState(false);

    const handleApplicantDetails = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantDetails(true);
    }

    const handleBlacklist = (applicantId) => {
        setApplicantId(applicantId);
        setShowBlacklist(true);
    }

    const loadTotals = async () => {
        try {
            const { success, message, totals } = await fetchHiredTotals();
            if (success) return setTotals(totals);
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const loadTable = async () => {
        try {
            const { success, message, applicants, pagination: apiPagination } = await fetchAllHired({
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
        } catch (error) {
            console.error(error);
        }
    }

    const runFetchAllCompany = async () => {
        const { success, message, companies } = await fetchAllSelectCompany();

        if (success) {
            setSelectCompanies(companies);
        } else {
            console.error(message);
        }
    };

    const handleRejectApplicant = (applicantId) => {
        setApplicantId(applicantId);
        setShowEmployeeLeft(true);
    }

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

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Topbar />
                        <div className="p-8 overflow-auto grow">

                            {/* hired header */}
                            <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                                <div>
                                    <p className="text-2xl font-semibold">Hired Applicants</p>
                                    <p className="text-gray-500">View all successfully hired employees</p>
                                </div>
                            </section>

                            {/* hired totals */}
                            <section className="grid lg:grid-cols-4 gap-4 mb-8">
                                <div className="border border-gray-300 px-4 py-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Total Hired</p>
                                        <UserCheck size={16} className="text-emerald-500 shrink-0" />
                                    </div>
                                    <p className="font-bold text-2xl">{totals.totalHired}</p>
                                </div>
                                <div className="border border-gray-300 px-4 py-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">This Month</p>
                                        <Calendar size={16} className="text-gray-500 shrink-0" />
                                    </div>
                                    <p className="font-bold text-2xl">{totals.thisMonth}</p>
                                </div>
                                <div className="border border-gray-300 px-4 py-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Companies</p>
                                        <Building2 size={16} className="text-gray-500 shrink-0" />
                                    </div>
                                    <p className="font-bold text-2xl">{totals.companies}</p>
                                </div>
                                <div className="border border-gray-300 px-4 py-6 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Positions</p>
                                        <UserCheck size={16} className="text-gray-500 shrink-0" />
                                    </div>
                                    <p className="font-bold text-2xl">{totals.position}</p>
                                </div>
                            </section>

                            {/* hired table */}
                            <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
                                    <div className="flex bg-gray-100 rounded-lg">
                                        <div className="grow">
                                            <Input
                                                placeholder="Search by name, email, position, or company..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
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
                                                    <th>Name</th>
                                                    <th>Position</th>
                                                    <th>Company</th>
                                                    <th>Contact</th>
                                                    <th>Hired Date</th>
                                                    <th>Applied Date</th>
                                                    <th className="action-cell">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map(applicant => (
                                                    <tr key={applicant?.id}>
                                                        <td>
                                                            <p className="text-sm font-semibold">{applicant?.fullname}</p>
                                                            {applicant?.user?.applicants?.length > 0 &&
                                                                <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md w-min">
                                                                    <Ban size={16} />
                                                                    Blacklisted
                                                                </div>
                                                            }
                                                        </td>
                                                        <td>
                                                            {applicant?.job?.jobTitle}
                                                        </td>
                                                        <td>
                                                            {applicant?.job?.company?.companyName}
                                                        </td>
                                                        <td>
                                                            <div>
                                                                <p className="flex gap-2 items-center"> <Calendar size={12} />{applicant?.user?.email}</p>
                                                                <p className="flex gap-2 items-center"> <MapPin size={12} />{applicant?.phone}</p>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className="status-style text-white bg-emerald-500">
                                                                {
                                                                    applicant?.applicantStatusHistories?.find(s => s.applicantStatus === "Hired")?.createdAt &&
                                                                    cleanDateTime(applicant?.applicantStatusHistories?.find(s => s.applicantStatus === "Hired")?.createdAt)
                                                                }
                                                            </p>
                                                        </td>
                                                        <td>
                                                            {
                                                                applicant?.applicantStatusHistories?.find(s => s.applicantStatus === "New")?.createdAt &&
                                                                cleanDateTime(applicant?.applicantStatusHistories?.find(s => s.applicantStatus === "New")?.createdAt)
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
                                                                        <DropdownMenu.Item
                                                                            onClick={() => handleApplicantDetails(applicant?.id)}
                                                                        >
                                                                            <Eye size={16} />
                                                                            View Details
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.Item
                                                                            onClick={() => handleRejectApplicant(applicant?.id)}
                                                                        >
                                                                            <Eye size={16} />
                                                                            Employee left
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                                                        <DropdownMenu.Item
                                                                            onClick={() => handleBlacklist(applicant?.id)}
                                                                        >
                                                                            <Ban size={16} />
                                                                            Blacklist
                                                                        </DropdownMenu.Item>
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
                    </>
                )}
            </div>

            {showApplicantDetails &&
                <ApplicantDetails
                    applicantId={applicantId}
                    onClose={() => setShowApplicantDetails(false)}
                />
            }
            {showBlacklist &&
                <Blacklist
                    applicantId={applicantId}
                    onClose={() => setShowBlacklist(false)}
                    loadAfter={loadTable}
                />
            }
            {showEmployeeLeft &&
                <EmployeeLeft
                    applicantId={applicantId}
                    onClose={() => setShowEmployeeLeft(false)}
                    loadAfter={loadAfter}
                />
            }
        </div>
    )
}