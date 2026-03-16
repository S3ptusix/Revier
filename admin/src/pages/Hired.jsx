/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Ban, Building2, Calendar, Clock, CircleX, EllipsisVertical, Eye, MapPin, Pen, Search, UserCheck } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect } from "react";
import { useState } from "react";
import { cleanDateTime } from "../utils/format";
import { fetchAllHired, fetchHiredTotals } from "../services/hiredServices";
import RejectApplicant from "../components/RejectApplicant";
import ApplicantStatusHistory from "../components/ApplicantStatusHistory";
import Input from "../components/ui/Input";
import Blacklist from "../components/Blacklist";

export default function Hired() {

    const [toSearch, setToSearch] = useState('');
    const [search, setSearch] = useState('');

    const [totals, setTotals] = useState({
        totalHired: 0,
        thisMonth: 0,
        companies: 0,
        position: 0
    });
    const [data, setData] = useState([]);

    const [applicantId, setApplicantId] = useState(null);

    const [showRejectApplicant, setShowRejectApplicant] = useState(false);
    const [showApplicantStatusHistory, setShowApplicantStatusHistory] = useState(false);
    const [showBlacklist, setShowBlacklist] = useState(false);

    const handleRejectApplicant = (applicantId) => {
        setApplicantId(applicantId);
        setShowRejectApplicant(true);
    }

    const handleApplicantStatusHistory = (applicantId) => {
        setApplicantId(applicantId);
        setShowApplicantStatusHistory(true);
    }

    const handleBlacklist = (applicantId) => {
        setApplicantId(applicantId);
        setShowBlacklist(true);
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchHiredTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, applicants } = await fetchAllHired({ search: toSearch });
        if (success) return setData(applicants);
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
    }, [toSearch]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
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

                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <p className="font-semibold grow">All Hired Employees</p>

                            <div className="flex bg-gray-100 rounded-lg">
                                <Input
                                    placeholder="Search by name, email, position, or company..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-ghost rounded-r-lg"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Contact</th>
                                        <th>Date Hired</th>
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
                                                <p className="status-style text-white bg-emerald-500">{applicant?.interviewStatus}</p>
                                            </td>
                                            <td>
                                                -
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
                                                                <Eye size={16} />
                                                                View Details
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
                                                            <DropdownMenu.Item
                                                                onClick={() => handleApplicantStatusHistory(applicant?.id)}
                                                            >
                                                                <Clock size={16} />
                                                                View History
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item
                                                                onClick={() => handleRejectApplicant(applicant?.id)}
                                                            >
                                                                <CircleX size={16} />
                                                                rejected
                                                            </DropdownMenu.Item>
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
                    </section>
                </div>
            </div>

            {showRejectApplicant &&
                <RejectApplicant
                    applicantId={applicantId}
                    onClose={() => setShowRejectApplicant(false)}
                    loadAfter={loadTable}
                />
            }
            {showApplicantStatusHistory &&
                <ApplicantStatusHistory
                    applicantId={applicantId}
                    onClose={() => setShowApplicantStatusHistory(false)}
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