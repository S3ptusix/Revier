/* eslint-disable react-hooks/exhaustive-deps */
import SideMenu from "../components/SideMenu";
import { Ban, Building2, Calendar, EllipsisVertical, Eye, Mail, MapPin, Phone, Search, UserCheck } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import { useState } from "react";
import { formatReadableDate } from "../utils/format";
import { fetchAllHired } from "../services/hiredServices";
import Input from "../components/ui/Input";
import Blacklist from "../components/Blacklist";
import ApplicantDetails from "../components/ApplicantDetails";
import Pagination from "../components/Pagination";
import { fetchAllSelectCompany } from "../services/companyServices";
import Select from "../components/ui/Select";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";

export default function Hired() {

    const [isLoading, setIsLoading] = useState(false);

    const [toSearch, setToSearch] = useState('');
    const [search, setSearch] = useState('');

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

    const handleApplicantDetails = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantDetails(true);
    }

    const handleBlacklist = (applicantId) => {
        setApplicantId(applicantId);
        setShowBlacklist(true);
    }

    const loadTable = async () => {
        try {
            setIsLoading(true);
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
        } finally {
            setIsLoading(false);
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

    useEffect(() => {
        loadTable();
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
            <SideMenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* hired header */}
                        <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <p className="text-2xl font-semibold">Hired Applicants</p>
                                <p className="text-gray-500">View all successfully hired employees</p>
                            </div>
                        </section>

                        {/* hired table */}
                        <section>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                                <div className="flex bg-gray-100 rounded-lg">
                                    <div className="grow">
                                        <Input
                                            placeholder="Search Hired"
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
                                <div className="table-style rounded-lg">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Position</th>
                                                <th>Company</th>
                                                <th>Applied Date</th>
                                                <th>Hired Date</th>
                                                <th className="action-cell">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(applicant => (
                                                <tr key={applicant?.id}>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative profile-logo h-10 w-10">
                                                                {applicant?.firstName[0]}{applicant?.lastName[0]}
                                                                {applicant?.user?.applicants?.length > 0 &&
                                                                    <div className="absolute -top-1 -right-1 tooltip rounded-full bg-black p-0.5 text-white" data-tip="Blacklisted">
                                                                        <Ban size={16} />
                                                                    </div>
                                                                }

                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">{applicant?.firstName} {applicant?.lastName}</p>
                                                                <p className="text-sm text-gray-500">{applicant?.user?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {applicant?.job?.jobTitle}
                                                    </td>
                                                    <td>
                                                        {applicant?.job?.company?.companyName}
                                                    </td>
                                                    <td>
                                                        {formatReadableDate(applicant?.createdAt)}
                                                    </td>
                                                    <td>
                                                        <p className="status-style text-white bg-emerald-500">
                                                            {formatReadableDate(applicant?.hiredAt)}
                                                        </p>
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
                                    <NoData />
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
        </div>
    )
}