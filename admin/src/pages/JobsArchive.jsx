/* eslint-disable react-hooks/exhaustive-deps */
import { Archive, ArchiveRestore, Briefcase, EllipsisVertical, MapPin, Plus, Search, SquarePen, Table2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import AddJob from "../components/AddJob";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { employmentTypes } from "../utils/data";
import DeleteJob from "../components/DeleteJob";
import { fetchAllArchiveJob } from "../services/jobServices";
import { useEffect } from "react";
import EditJob from "../components/EditJob";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Pagination from "../components/Pagination";
import { fetchAllSelectCompany } from "../services/companyServices";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import RestoreJob from "../components/RestoreJob";

export default function JobsArchive() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [type, setType] = useState('');

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    })

    const [jobId, setJobId] = useState(null);
    const [openRestoreModal, setOpenRestoreModal] = useState(false);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const handleRestoreJob = (jobId) => {
        setJobId(jobId);
        setOpenRestoreModal(true);
    }

    const loadTable = async () => {
        const { success, message, jobs, pagination: apiPagination } = await fetchAllArchiveJob({
            search: toSearch,
            type,
            companyId,
            page
        });

        if (success) {
            setData(jobs);
            setPagination(apiPagination);
            return
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
                loadTable(),
                runFetchAllCompany(),
            ]);
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
        try {
            setPage(1);
        } catch (error) {
            console.error(error);
        }
    }, [toSearch, status, type, companyId]);

    useEffect(() => {
        try {
            loadTable();
        } catch (error) {
            console.error(error);
        }
    }, [toSearch, status, type, companyId, page]);

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
                                <p className="text-2xl font-semibold">Jobs Archive</p>
                                <p className="text-gray-500">View and manage archived jobs</p>
                            </div>

                            <div className="tooltip" data-tip="Active Jobs">
                                <button
                                    className="btn btn-neutral rounded-lg"
                                    onClick={() => navigate('/app/jobs')}
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
                                            placeholder="Search Job"
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
                                    placeholder="All Job Type"
                                    options={employmentTypes}
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
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
                                                <th>Job Title</th>
                                                <th>Company</th>
                                                <th>Location</th>
                                                <th>Type</th>
                                                <th className="action-cell">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(job => (
                                                <tr key={job?.id}>
                                                    <td>
                                                        <p className="font-semibold">{job?.jobTitle}</p>
                                                    </td>
                                                    <td>
                                                        <p>{job?.company?.companyName}</p>
                                                    </td>
                                                    <td>
                                                        <div className="flex items-center text-gray-500 gap-1">
                                                            <MapPin size={12} className="shrink-0" />
                                                            <p className="truncate">
                                                                {job?.company?.location}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className="status-style border border-gray-300">{job?.type}</p>
                                                    </td>
                                                    <td>
                                                        <div className="flex-center">
                                                            <button
                                                                className="btn btn-sm whitespace-nowrap rounded-xl"
                                                                onClick={() => handleRestoreJob(job.id)}
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

            {openRestoreModal && <RestoreJob jobId={jobId} onClose={() => setOpenRestoreModal(false)} loadAfter={loadAfter} />}

        </div>
    )
}