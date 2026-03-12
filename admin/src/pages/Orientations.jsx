import { Calendar, ChevronLeft, CircleCheckBig, CircleX, EllipsisVertical, MapPin, Plus, Users } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { useState } from "react";
import AddEvent from "../components/AddEvent";
import { deleteOrientation, fetchAllOrientation, fetchAllOrientationEvent } from "../services/orientationsServices";
import { useEffect } from "react";
import AddToEvent from "../components/AddToEvent";
import TrackAttendance from "../components/TrackAttendance";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cleanDateTime } from "../utils/format";
import EditEvent from "../components/EditEvent";

export default function Orientations() {

    const [orientations, setOrientations] = useState([]);
    const [applicants, setApplicants] = useState([]);

    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const [applicantId, setApplicantId] = useState(null);
    const [openAddToEvent, setOpenAddToEvent] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);

    const handleAddToEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenAddToEvent(true);
    }

    const handleEditEvent = (orientationId) => {
        setOrientationId(orientationId);
        setOpenEditEvent(true);
    }

    const handleTrackAttendance = (orientationId) => {
        setOrientationId(orientationId);
        setOpenTrackAttendance(true);
    }

    const loadEvents = async () => {
        const { success, message, orientationEvents } = await fetchAllOrientationEvent();
        if (success) return setOrientations(orientationEvents);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, applicants } = await fetchAllOrientation();
        if (success) return setApplicants(applicants);
        console.error(message);
    }

    const handlDeleteOrientation = async (orientationId) => {
        try {
            const { success, message } = await deleteOrientation(orientationId);
            if (success) {
                loadTable();
                loadEvents();
                return
            }
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTable();
                loadEvents();
            })
        } catch (error) {
            console.error(error);
        }
    }, []);

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
                            onClick={() => setOpenCreateEvent(true)}
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
                            <div key={orientation?.id} className="border border-gray-300 p-4 rounded-lg mb-4">
                                <div className="flex justify-between flex-wrap gap-4 mb-4">

                                    <p className="text-lg font-semibold">{orientation?.eventTitle}</p>

                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            className="btn btn-ghost border-gray-300"
                                            onClick={() => handleTrackAttendance(orientation?.id)}
                                        >
                                            Track Attendance
                                        </button>
                                        <DropdownMenu.Root>
                                            <DropdownMenu.Trigger className="btn btn-square rounded-lg">
                                                <EllipsisVertical size={16} />
                                            </DropdownMenu.Trigger>

                                            <DropdownMenu.Content
                                                align="end"
                                                className="minimenu"
                                            >
                                                <DropdownMenu.Item
                                                    onClick={() => handleEditEvent(orientation?.id)}
                                                >
                                                    Edit Event
                                                </DropdownMenu.Item>
                                                <DropdownMenu.Item
                                                    onClick={() => handlDeleteOrientation(orientation?.id)}
                                                >
                                                    Delete Event
                                                </DropdownMenu.Item>
                                            </DropdownMenu.Content>
                                        </DropdownMenu.Root>
                                    </div>
                                </div>

                                <div className="flex md:items-center justify-between max-md:flex-col gap-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <Calendar size={16} />
                                        <p className="text-sm">{cleanDateTime(orientation?.eventAt)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin size={16} />
                                        <p className="text-sm">{orientation?.location}</p>
                                    </div>
                                </div>

                                <p className="font-semibold text-sm mb-2">Attendees ({orientation?.applicants?.length}):</p>
                                <div className="flex gap-4 flex-wrap">
                                    {orientation?.applicants?.map((applicant, index) => (
                                        <span key={index} className="flex gap-2 bg-gray-200 py-1 px-2 w-fit rounded-full">
                                            <div className="flex-center bg-emerald-500 text-white rounded-full h-6 w-6 text-sm">
                                                {applicant?.fullname[0]}
                                            </div>
                                            <p className="text-sm">{applicant?.fullname}</p>
                                            <span className={`${applicant?.orientationStatus === 'Present' ? 'bg-emerald-500' : applicant?.orientationStatus === 'Absent' ? 'bg-red-500' : 'bg-purple-500'} text-white text-xs font-semibold py-1 px-2 rounded-md`}>
                                                {applicant?.orientationStatus}
                                            </span>
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
                                                <p className={`status-style text-white ${applicant?.orientationStatus === 'Pending' ? 'bg-purple-500' : applicant?.orientationStatus === 'Attended' ? 'bg-emerald-500' : 'bg-red-500'}`}> {applicant?.orientationStatus}</p>
                                            </td>
                                            <td>
                                                <div className="flex-center">
                                                    <button
                                                        className="btn btn-sm whitespace-nowrap rounded-xl"
                                                        onClick={() => handleAddToEvent(applicant?.id)}
                                                    >
                                                        <ChevronLeft size={16} />
                                                        Add to event
                                                    </button>
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
            {openCreateEvent &&
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                    loadAfter={loadEvents}
                />
            }

            {openEditEvent &&
                <EditEvent
                    orientationId={orientationId}
                    onClose={() => setOpenEditEvent(false)}
                    loadAfter={loadEvents}
                />
            }

            {openAddToEvent &&
                <AddToEvent
                    applicantId={applicantId}
                    onClose={() => setOpenAddToEvent(false)}
                    loadAfter={() => {
                        loadTable();
                        loadEvents();
                    }}
                />
            }

            {openTrackAttendance &&
                <TrackAttendance
                    orientationId={orientationId}
                    onClose={() => setOpenTrackAttendance(false)}
                    loadAfter={() => {
                        loadTable();
                        loadEvents();
                    }}
                />
            }
        </div>
    )
}