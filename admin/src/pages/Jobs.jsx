import { Briefcase, EllipsisVertical, MapPin, Plus, Search, SquarePen, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import AddJob from "../components/AddJob";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { employmentTypes } from "../utils/data";



export default function Jobs() {

    const [openAddJob, setOpenAddJob] = useState(false);

    const jobs = [
        {
            id: 1,
            jobTitle: "Senior Software Engineer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            type: "fulltime",
            applicants: 45,
            status: "open",
            postedAt: "2026-01-15",
        },
        {
            id: 2,
            jobTitle: "Marketing Manager",
            company: "HealthPlus Medical",
            location: "New York, NY",
            type: "fulltime",
            applicants: 32,
            status: "closed",
            postedAt: "2026-01-20",
        },
    ];

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto">

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
                    <section className="grid md:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Jobs</p>
                                <Briefcase size={16} className="text-gray-500" />
                            </div>
                            <p className="font-bold text-2xl">6</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Open Positions</p>
                                <Briefcase size={16} className="text-emerald-500" />
                            </div>
                            <p className="font-bold text-2xl">5</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Closed</p>
                                <Briefcase size={16} className="text-red-500" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applicants</p>
                                <Briefcase size={16} className="text-gray-500" />
                            </div>
                            <p className="font-bold text-2xl">242</p>
                        </div>
                    </section>

                    {/* company table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">
                        <div className="flex gap-4 md:justify-between mb-8 flex-wrap">
                            <div className="flex input-search-container grow">
                                <Search className="search-icon" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Jobs..."
                                    className="input-search grow"
                                />
                            </div>
                            <div className="flex gap-4 grow">
                                <select
                                    name="industry"
                                    className="select w-full grow"
                                >
                                    <option value="">All Status</option>
                                    <option value="open">Open</option>
                                    <option value="closed">Closed</option>
                                </select>
                                <select
                                    name="industry"
                                    className="select w-full grow"
                                >
                                    <option value="">All Types</option>
                                    {employmentTypes.map((employmentType, index) => (
                                        <option key={index} value={employmentType}>{employmentType}</option>
                                    ))}
                                </select>
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
                                    {jobs.map(job => (
                                        <tr key={job?.id}>
                                            <td>
                                                <p className="font-semibold">{job?.jobTitle}</p>
                                            </td>
                                            <td>
                                                <p>{job?.company}</p>
                                            </td>
                                            <td>
                                                <p className="flex items-center text-gray-500 gap-1">
                                                    <MapPin size={12} />
                                                    {job?.location}
                                                </p>
                                            </td>
                                            <td>
                                                <p className="status-style border border-gray-300">{job?.type}</p>
                                            </td>
                                            <td>
                                                <p className="font-semibold flex items-center gap-1">
                                                    {job?.applicants}
                                                    <span className="font-normal text-gray-500 text-xs">applicants</span>
                                                </p>
                                            </td>
                                            <td>
                                                <p className={`status-style text-white ${job?.status === 'open' ? 'bg-emerald-500' : 'bg-red-500'}`}>{job?.status}</p>
                                            </td>
                                            <td>
                                                <p>{job?.postedAt}</p>
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
                                                            <DropdownMenu.Item>
                                                                <SquarePen size={16} />
                                                                Edit
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item>
                                                                {job?.status === 'open' ? 'Close Job' : 'Reopen Job'}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item className={`text-red-500 ${job?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}>
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

            {openAddJob && <AddJob onClose={() => setOpenAddJob(false)} />}
        </div>
    )
}