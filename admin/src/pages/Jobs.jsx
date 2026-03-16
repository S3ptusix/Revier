/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, EllipsisVertical, MapPin, Plus, Search, SquarePen, Trash2 } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
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
import { cleanDateTime } from "../utils/format";



export default function Jobs() {

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

    const [jobId, setJobId] = useState(null);

    const [openAddJob, setOpenAddJob] = useState(false);
    const [openEditJob, setOpenEditJob] = useState(false);
    const [openDeleteJob, setOpenDeleteJob] = useState(false);

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
            if (success) {
                return loadTable();
            }
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
        const { success, message, jobs } = await fetchAllJob({ search: toSearch, status, type });
        if (success) return setData(jobs);
        console.error(message);
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTotals();
                loadTable();
            })
        } catch (error) {
            console.error(error);
        }
    }, [toSearch, status, type]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* company header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Jobs</p>
                            <p className="text-gray-500">Post and manage job openings</p>
                        </div>
                        <button
                            className="btn bg-emerald-500 text-white rounded-lg"
                            onClick={() => setOpenAddJob(true)}
                        >
                            <Plus size={16} />
                            <p className="font-semibold text-sm cursor-pointer">Post New Job</p>
                        </button>
                    </section>

                    {/* company totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Jobs</p>
                                <Briefcase size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.totalJobs}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Open Positions</p>
                                <Briefcase size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.openPositions}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Closed</p>
                                <Briefcase size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.closed}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applicants</p>
                                <Briefcase size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.totalApplicants}</p>
                        </div>
                    </section>

                    {/* company table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">
                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                <Input
                                    placeholder="Search Jobs..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-ghost rounded-lg"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                </button>
                            </div>

                            <div className="flex gap-4 grow">
                                <Select
                                    placeholder="All Status"
                                    options={[
                                        { value: 'open', name: 'Open' },
                                        { value: 'closed', name: 'Closed' }
                                    ]}
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                />
                                <Select
                                    placeholder="All Type"
                                    options={employmentTypes}
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Job Title</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Type</th>
                                        <th>Applicants</th>
                                        <th>Status</th>
                                        <th>Posted Date</th>
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
                                                <p className="flex items-center text-gray-500 gap-1">
                                                    <MapPin size={12} />
                                                    {job?.company?.location}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="status-style border border-gray-300">{job?.type}</p>
                                            </td>
                                            <td>
                                                <p className="font-semibold flex items-center gap-1">
                                                    {job?.applicantCount}
                                                    <span className="font-normal text-gray-500 text-xs">applicants</span>
                                                </p>
                                            </td>
                                            <td>
                                                <p className={`status-style text-white ${job?.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'}`}>{job?.status}</p>
                                            </td>
                                            <td>
                                                <p>{cleanDateTime(job?.postedAt)}</p>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            {openAddJob &&
                <AddJob
                    onClose={() => setOpenAddJob(false)}
                    loadTable={loadTable}
                />
            }

            {openEditJob &&
                <EditJob
                    jobId={jobId}
                    onClose={() => setOpenEditJob(false)}
                    loadTable={loadTable}
                />
            }

            {openDeleteJob &&
                <DeleteJob
                    jobId={jobId}
                    onClose={() => setOpenDeleteJob(false)}
                    loadTable={loadTable}
                />
            }
        </div>
    )
}