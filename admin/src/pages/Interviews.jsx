import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Calendar, CircleCheckBig, CircleX, EllipsisVertical, MapPin, SquarePen, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Interviews() {

    const applicants = [
        {
            id: 1,
            fullname: 'John Doe',
            email: 'john.doe@email.com',
            position: 'Software Engineer',
            company: "TechCorp Inc.",
            interviewAt: "2026-01-30 at 10:00 AM",
            interviewLocation: "In-Person",
            interviewStatus: "Pending Interview"
        },
        {
            id: 2,
            fullname: 'John Doe',
            email: 'john.doe@email.com',
            position: 'Software Engineer',
            company: "TechCorp Inc.",
            interviewAt: "2026-01-30 at 1:00 PM",
            interviewLocation: "In-Person",
            interviewStatus: "Failed Interview"
        },
        {
            id: 3,
            fullname: 'John Doe',
            email: 'john.doe@email.com',
            position: 'Software Engineer',
            company: "TechCorp Inc.",
            interviewAt: null,
            interviewLocation: null,
            interviewStatus: "Pending Interview"
        }
    ]

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* interviews header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Interview Management</p>
                            <p className="text-gray-500">Schedule and track candidate interviews</p>
                        </div>
                    </section>

                    {/* interviews totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Pending Interviews</p>
                                <Calendar size={16} className="text-blue-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">3</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Passed</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Failed</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total</p>
                                <User size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">5</p>
                        </div>
                    </section>

                    {/* admin table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <p className="font-semibold grow">Interview Candidates</p>

                            <select
                                name="industry"
                                className="select grow"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending Interview">Pending Interview</option>
                                <option value="Passed Interview">Passed Interview</option>
                                <option value="Failed Interview">Failed Interview</option>
                            </select>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Interview Details</th>
                                        <th>Status</th>
                                        <th className="action-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants.map(applicant => (
                                        <tr key={applicant?.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="profile-logo h-10 w-10">{applicant?.fullname[0]}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold">{applicant?.fullname}</p>
                                                        <p className="text-sm text-gray-500">{applicant?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{applicant?.position}</p>
                                            </td>
                                            <td>
                                                <p>{applicant?.company}</p>
                                            </td>
                                            <td>
                                                {applicant?.interviewAt ?
                                                    (
                                                        <>
                                                            <p className="flex gap-2 items-center"> <Calendar size={12} />{applicant?.interviewAt}</p>
                                                            <p className="flex gap-2 items-center"> <MapPin size={12} />{applicant?.interviewLocation}</p>
                                                        </>
                                                    ) :
                                                    (<p className="text-gray-500">Not scheduled</p>)
                                                }
                                            </td>
                                            <td>
                                                <p className={` status-style text-white ${applicant?.interviewStatus === 'Pending Interview' ? 'bg-blue-500' : applicant?.interviewStatus === 'Passed Interview' ? 'bg-emerald-500' : 'bg-red-500'}`}>{applicant?.interviewStatus}</p>
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
                                                            {applicant?.interviewAt ? (
                                                                <DropdownMenu.Item>
                                                                    <Calendar size={16} />
                                                                    Reschedule Interview
                                                                </DropdownMenu.Item>
                                                            ) : (
                                                                <DropdownMenu.Item>
                                                                    <Calendar size={16} />
                                                                    Schedule Interview
                                                                </DropdownMenu.Item>
                                                            )}

                                                            {(applicant?.interviewStatus === 'Pending Interview' && applicant?.interviewAt !== null) &&
                                                                <DropdownMenu.Item>
                                                                    <CircleCheckBig size={16} />
                                                                    Update Result
                                                                </DropdownMenu.Item>
                                                            }

                                                            {/* <DropdownMenu.Item>
                                                                {admin?.status === 'active' ? 'Deactivate' : 'active'}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item className={`text-red-500 ${admin?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}>
                                                                <Trash2 size={16} />
                                                                Delete
                                                            </DropdownMenu.Item> */}
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
        </div>
    )
}