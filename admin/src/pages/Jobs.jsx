/* eslint-disable react-hooks/exhaustive-deps */
import { Archive, Briefcase, CalendarDays, CircleCheck, CircleX, Clock, EllipsisVertical, Layers, MapPin, Plus, Search, SquarePen, Trash2, Users } from "lucide-react";
import SideMenu from "../components/SideMenu";
import AddJob from "../components/AddJob";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { employmentTypes } from "../utils/data";
import DeleteJob from "../components/DeleteJob";
import { editJobStatus, fetchAllJob, fetchJobTotals } from "../services/jobServices";
import { useEffect } from "react";
import EditJob from "../components/EditJob";
import { toast } from "react-toastify";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import Pagination from "../components/Pagination";
import { fetchAllSelectCompany } from "../services/companyServices";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { formatShortDateTime } from "../utils/format";

export default function Jobs() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const [totals, setTotals] = useState({
        totalJobs: 0,
        openPositions: 0,
        closed: 0,
        totalApplicants: 0
    });
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    })

    const [jobId, setJobId] = useState(null);

    const [openAddJob, setOpenAddJob] = useState(false);
    const [openEditJob, setOpenEditJob] = useState(false);
    const [openDeleteJob, setOpenDeleteJob] = useState(false);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const handleEdit = (jobId) => {
        setJobId(jobId);
        setOpenEditJob(true);
    }

    const handleDelete = (jobId) => {
        setJobId(jobId);
        setOpenDeleteJob(true);
    }

    const handleEditJobStatus = async (jobId, status) => {
        try {
            const { success, message } = await editJobStatus(jobId, { status: status });
            if (success) return loadAfter();

            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchJobTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, jobs, pagination: apiPagination } = await fetchAllJob({
            search: toSearch,
            status,
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
                loadTotals(),
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
            <SideMenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

                        {/* header */}
                        <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                            <div>
                                <p className="text-2xl font-semibold">Jobs</p>
                                <p className="text-gray-500">Post and manage job openings</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="btn bg-emerald-500 text-white rounded-lg"
                                    onClick={() => setOpenAddJob(true)}
                                >
                                    <Plus size={16} />
                                    <p className="font-semibold text-sm cursor-pointer">Post New Job</p>
                                </button>
                                <div className="tooltip" data-tip="Archieve">
                                    <button
                                        className="btn btn-neutral rounded-lg"
                                        onClick={() => navigate('/app/jobs/archive')}
                                    >
                                        <Archive size={16} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* totals */}
                        <section className="grid lg:grid-cols-3 gap-4 mb-8">
                            {/* <div className="border border-gray-300 px-4 py-6 rounded-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <p className="font-semibold text-sm">Total Jobs</p>
                                    <Briefcase size={16} className="text-gray-500 shrink-0" />
                                </div>
                                <p className="font-bold text-2xl">{totals.totalJobs}</p>
                            </div> */}
                            <div className="bg-white border border-gray-300 px-4 py-6 rounded-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <p className="font-semibold text-sm">Open Positions</p>
                                    <Briefcase size={16} className="text-emerald-500 shrink-0" />
                                </div>
                                <p className="font-bold text-2xl">{totals.openPositions}</p>
                            </div>
                            <div className="bg-white border border-gray-300 px-4 py-6 rounded-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <p className="font-semibold text-sm">Closed</p>
                                    <Briefcase size={16} className="text-red-500 shrink-0" />
                                </div>
                                <p className="font-bold text-2xl">{totals.closed}</p>
                            </div>
                            <div className="bg-white border border-gray-300 px-4 py-6 rounded-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <p className="font-semibold text-sm">Total Applicants</p>
                                    <Briefcase size={16} className="text-gray-500 shrink-0" />
                                </div>
                                <p className="font-bold text-2xl">{totals.totalApplicants}</p>
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
                                    placeholder="All Job Status"
                                    options={[
                                        { value: 'open', name: 'Open' },
                                        { value: 'closed', name: 'Closed' }
                                    ]}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
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
                                                <th>Slot</th>
                                                <th>Type</th>
                                                <th>Applicants</th>
                                                <th>Status</th>
                                                <th>Posted Date</th>
                                                <th className="action-cell">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map(job => {

                                                const type = job?.type?.toLowerCase();

                                                const typeConfig = {
                                                    "full-time": {
                                                        label: "Full Time",
                                                        icon: <Briefcase size={14} />,
                                                        style: "bg-blue-50 text-blue-600 border border-blue-200"
                                                    },
                                                    "part-time": {
                                                        label: "Part Time",
                                                        icon: <Clock size={14} />,
                                                        style: "bg-amber-50 text-amber-600 border border-amber-200"
                                                    },
                                                    "contract": {
                                                        label: "Contract",
                                                        icon: <CalendarDays size={14} />,
                                                        style: "bg-purple-50 text-purple-600 border border-purple-200"
                                                    },
                                                    "internship": {
                                                        label: "Internship",
                                                        icon: <Layers size={14} />,
                                                        style: "bg-pink-50 text-pink-600 border border-pink-200"
                                                    }
                                                };

                                                const config = typeConfig[type] || {
                                                    label: job?.type || "Unknown",
                                                    icon: <Briefcase size={14} />,
                                                    style: "bg-gray-50 text-gray-600 border border-gray-200"
                                                };

                                                const isOpen = job?.status === "open";

                                                return (
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
                                                            <p>{job?.slot}</p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                className={`
                                                                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                                    ${config.style}
                                                                `}
                                                            >
                                                                {config.icon}
                                                                {config.label}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p className="flex items-center gap-2 text-gray-700">
                                                                <Users size={14} className="text-gray-400" />

                                                                <span className="text-sm font-semibold">
                                                                    {job?.applicantCount ?? 0}
                                                                </span>

                                                                <span className="text-xs text-gray-500">
                                                                    applicants
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p
                                                                className={`
                                                                    inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                                                                    ${isOpen
                                                                        ? "bg-emerald-50 text-emerald-600"
                                                                        : "bg-red-50 text-red-500"}
                                                                `}
                                                            >
                                                                {isOpen ? <CircleCheck size={14} /> : <CircleX size={14} />}
                                                                <span className="capitalize">
                                                                    {isOpen ? "Open" : "Closed"}
                                                                </span>
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <p>{job?.postedAt ? formatShortDateTime(job?.postedAt) : '-'}</p>
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
                                                                            onClick={() => handleEdit(job?.id)}
                                                                        >
                                                                            <SquarePen size={16} />
                                                                            Edit
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.Item
                                                                            onClick={() => handleEditJobStatus(job.id, job.status)}
                                                                        >
                                                                            {job?.status === 'open' ? 'Close Job' : 'Reopen Job'}
                                                                        </DropdownMenu.Item>
                                                                        <DropdownMenu.Item
                                                                            className={`text-red-500 ${job?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}
                                                                            onClick={() => handleDelete(job?.id)}
                                                                        >
                                                                            <Trash2 size={16} />
                                                                            Delete
                                                                        </DropdownMenu.Item>
                                                                    </DropdownMenu.Content>
                                                                </DropdownMenu.Root>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
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

            {
                openAddJob &&
                <AddJob
                    onClose={() => setOpenAddJob(false)}
                    loadAfter={loadAfter}
                />
            }

            {
                openEditJob &&
                <EditJob
                    jobId={jobId}
                    onClose={() => setOpenEditJob(false)}
                    loadAfter={loadAfter}
                />
            }

            {
                openDeleteJob &&
                <DeleteJob
                    jobId={jobId}
                    onClose={() => setOpenDeleteJob(false)}
                    loadAfter={loadAfter}
                />
            }
        </div >
    )
}