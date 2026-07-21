/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { ArchiveRestore, Briefcase, Building2, EllipsisVertical, MapPin, Plus, Search, SquarePen, Table2, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import AddCompany from "../components/AddCompany";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { industries } from "../utils/data";
import { useEffect } from "react";
import { fetchAllArchiveCompany, fetchAllCompany, retoreCompany } from "../services/companyServices";
import DeleteCompany from "../components/DeleteCompany";
import EditCompany from "../components/EditCompany";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Pagination from "../components/Pagination";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RestoreCompany from "../components/RestoreCompany";


export default function CompaniesArchive() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [companyId, setCompanyId] = useState(null);
    const [openRestoreModal, setOpenRestoreModal] = useState(false);

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [industry, setIndustry] = useState('');

    const loadTable = async () => {
        const { success, message, companies, pagination: apiPagination } = await fetchAllArchiveCompany({ search: toSearch, industry, page });
        if (success) {
            setData(companies);
            setPagination(apiPagination);
            return;
        }
        console.error(message);
    }

    const handleRestoreCompany = (companyId) => {
        setCompanyId(companyId);
        setOpenRestoreModal(true);
    }

    useEffect(() => {
        loadTable();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [toSearch, industry]);

    useEffect(() => {
        loadTable();
    }, [toSearch, industry, page]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* header */}
                        <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <p className="text-2xl font-semibold">Company Archive</p>
                                <p className="text-gray-500">View and manage archived companies</p>
                            </div>

                            <div className="tooltip" data-tip="Active Companies">
                                <button
                                    className="btn btn-neutral rounded-lg"
                                    onClick={() => navigate('/app/companies')}
                                >
                                    <Table2 size={16} />
                                </button>
                            </div>
                        </section>

                        {/* table */}
                        <section>

                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-4">
                                <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                    <div className="grow">
                                        <Input
                                            placeholder="Search Company"
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
                                    placeholder="Select Company Industry"
                                    options={industries}
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />
                            </div>

                            {data.length > 0 ? (
                                <div className="table-style rounded-lg">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Company</th>
                                                <th>Industry</th>
                                                <th>Location</th>
                                                <th className="action-cell">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(company => (
                                                <tr key={company?.id}>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-emerald-500/25 text-emerald-500 rounded-lg p-2">
                                                                <Building2 />
                                                            </div>
                                                            <p className="text-sm font-semibold">{company?.companyName}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p>{company?.industry}</p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center text-gray-500 gap-1">
                                                            <MapPin size={12} className="shrink-0" />
                                                            <p className="truncate">{company?.location}</p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="flex-center">
                                                            <button
                                                                className="btn btn-sm whitespace-nowrap rounded-xl"
                                                                onClick={() => handleRestoreCompany(company.id)}
                                                            >
                                                                <ArchiveRestore size={16} /> Restore
                                                            </button>
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

            {openRestoreModal && <RestoreCompany companyId={companyId} onClose={() => setOpenRestoreModal(false)} loadAfter={loadTable} />}

        </div>
    )
}