import { Calendar, CircleCheckBig, CircleX, Clock, EllipsisVertical, MapPin, Plus, Search, SquarePen, Trash2, Users } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import AddAdmin from "../components/AddAdmin";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Modal, ModalBackground, ModalHeader } from "../components/ui/ui-modal";

export default function Orientations() {

    const [openAddAdmin, setOpenAddAdmin] = useState(false);

    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const applicants = [
        {
            id: 1,
            fullname: "Jahleel Casintahan",
            email: "jahleelnemuel@gmail.com",
            position: "data Analyst",
            company: "Company",
            status: "Pending"
        },
        {
            id: 2,
            fullname: "Jahleel Casintahan",
            email: "jahleelnemuel@gmail.com",
            position: "UX Designer",
            company: "Company",
            status: "Attended"
        },
        {
            id: 3,
            fullname: "Jahleel Casintahan",
            email: "jahleelnemuel@gmail.com",
            position: "HR Specialist",
            company: "Company",
            status: "Missed"
        },
    ];

    const orientations = [
        {
            id: 1,
            title: 'New Hire Orientation',
            company: 'TechCorp Inc.',
            location: 'Main Conference Room',
            date: '2026-02-05',
            time: '09:00 AM',
            attendees: [
                {
                    id: 1,
                    fullname: 'Michael Chen',
                    jobTitle: 'Software Manager',
                    company: 'TechCorp Inc.',
                    orientationStatus: 'Present'
                },
                {
                    id: 2,
                    fullname: 'Sarah Parker',
                    jobTitle: 'Marketing Manager',
                    company: 'TechCorp Inc.',
                    orientationStatus: 'Pending'
                }
            ],
            notes: ''
        },
        {
            id: 2,
            title: 'New Hire Orientation',
            company: 'TechCorp Inc.',
            location: 'Main Conference Room',
            date: '2026-02-05',
            time: '09:00 AM',
            attendees: [
                {
                    id: 3,
                    fullname: 'Sarah Parker',
                    jobTitle: 'Marketing Manager',
                    company: 'TechCorp Inc.',
                    orientationStatus: 'Absent'
                }
            ],
            notes: ''
        }
    ]

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* admin header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Orientation Management</p>
                            <p className="text-gray-500">Create orientation events and track attendance</p>
                        </div>
                        <button
                            className="btn bg-emerald-500 text-white rounded-lg"
                            onClick={() => setOpenAddAdmin(true)}
                        >
                            <Plus size={16} />
                            <p className="font-semibold text-sm cursor-pointer">Create Event</p>
                        </button>
                    </section>

                    {/* admin totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Pending Orientation</p>
                                <Users size={16} className="text-purple-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">3</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Attended</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Missed</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">3</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Events</p>
                                <Calendar size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">4</p>
                        </div>
                    </section>

                    <section className="border border-gray-300 p-4 rounded-xl mb-8">
                        <p className="font-semibold mb-4">Scheduled Orientation Events</p>
                        {orientations?.map(orientation => (
                            <div className="border border-gray-300 p-4 rounded-lg mb-4">
                                <div className="flex justify-between  flex-wrap gap-4 mb-4">
                                    <div>
                                        <p className="text-lg font-semibold">{orientation?.title}</p>
                                        <p className="text-sm text-gray-500">{orientation?.company}</p>
                                    </div>
                                    <button
                                        className="btn btn-ghost border-gray-300"
                                        onClick={() => setOpenCreateEvent(true)}
                                    >
                                        Track Attendance
                                    </button>
                                </div>

                                <div className="flex md:items-center justify-between max-md:flex-col gap-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={16} />
                                        <p className="text-sm">{orientation?.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Clock size={16} />
                                        <p className="text-sm">{orientation?.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin size={16} />
                                        <p className="text-sm">{orientation?.location}</p>
                                    </div>
                                </div>

                                <p className="font-semibold text-sm mb-2">Attendees (2):</p>
                                <div className="flex gap-4 flex-wrap">
                                    {orientation?.attendees?.map(attendee => (
                                        <span className="flex gap-2 bg-gray-200 py-1 px-2 w-fit rounded-full">
                                            <div className="flex-center bg-emerald-500 text-white rounded-full h-6 w-6 text-sm">
                                                {attendee?.fullname[0]}
                                            </div>
                                            <p className="text-sm">{attendee?.fullname}</p>
                                            <span className={`${attendee?.orientationStatus === 'Present' ? 'bg-emerald-500' : attendee?.orientationStatus === 'Absent' ? 'bg-red-500' : 'bg-purple-500'} text-white text-xs font-semibold py-1 px-2 rounded-md`}>{attendee?.orientationStatus}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="border border-gray-300 p-4 rounded-xl max-w-full">

                        <div className="flex gap-4 items-center  md:justify-between mb-8 flex-wrap">
                            <p className="grow font-semibold">Orientation Candidates</p>

                            <select
                                name="industry"
                                className="select grow"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Attended">Attended</option>
                                <option value="Missed">Missed</option>
                            </select>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Position</th>
                                        <th>Company</th>
                                        <th>Status</th>
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
                                                {applicant?.position}
                                            </td>
                                            <td>
                                                {applicant?.company}
                                            </td>
                                            <td>
                                                <p className={` status-style text-white ${applicant?.status === 'Pending' ? 'bg-purple-500' : applicant?.status === 'Attended' ? 'bg-emerald-500' : 'bg-red-500'}`}> {applicant?.status}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            <ModalBackground show={openCreateEvent}>
                <Modal maxWidth={500}>
                    <div className="mb-8">
                        <ModalHeader
                            title="Track Attendance"
                            subTitle="Mark attendance for New Hire Orientation"
                            onClose={() => setOpenCreateEvent(false)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <button className="btn bg-emerald-500 text-white rounded-lg">
                            <CircleCheckBig size={16} />
                            Mark All Present
                        </button>
                        <button className="btn bg-red-500 text-white rounded-lg">
                            <CircleX size={16} />
                            Mark All Absent
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex justify-between items-center border border-gray-300 rounded-lg p-2 w-full">
                            <div className="flex items-center gap-4">
                                <div className="flex-center h-10 w-10 rounded-full bg-emerald-500 text-white">
                                    M
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold">Michael Chen</p>
                                    <p className="text-gray-500 text-sm">Software Engineer</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-sm bg-emerald-500 text-white rounded-lg">
                                    <CircleCheckBig size={15} />
                                    Prensent
                                </button>
                                <button className="btn btn-sm bg-red-500 text-white rounded-lg">
                                    <CircleX size={16} />
                                    Absent
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </ModalBackground>

            {openAddAdmin && <AddAdmin onClose={() => setOpenAddAdmin(false)} />}
        </div>
    )
}