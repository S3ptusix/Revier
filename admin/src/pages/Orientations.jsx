/* eslint-disable react-hooks/exhaustive-deps */
import { Ban, Calendar, ChevronLeft, CircleCheckBig, CircleX, Eye, MapPin, Plus, Search, Users, X } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { useState } from "react";
import AddEvent from "../components/AddEvent";
import { fetchAllOrientation, fetchAllOrientationEvent, fetchOrientationTotals } from "../services/orientationsServices";
import { useEffect } from "react";
import AddToEvent from "../components/AddToEvent";
import TrackAttendance from "../components/TrackAttendance";
import { cleanDateTime } from "../utils/format";
import EditEvent from "../components/EditEvent";
import DeleteOrientationEvent from "../components/DeleteOrientationEvent";
import Select from "../components/ui/Select";
import Pagination from "../components/Pagination";
import { ModalBackground } from "../components/ui/ui-modal";
import { fetchAllSelectCompany } from "../services/companyServices";
import Input from "../components/ui/Input";
import NoData from "../components/ui/NoData";
import Loading from "../components/Loading";
import { useRef } from "react";

export default function Orientations() {

    const containerRef = useRef(null);

    const [isLoading, setIsloading] = useState(false);

    const [viewEvent, setViewEvent] = useState(false);

    const [totals, setTotals] = useState({
        pendingOrientation: 0,
        attended: 0,
        missed: 0,
        totalEvents: 0
    });
    const [orientations, setOrientations] = useState([]);
    const [orientationPage, setOrientationPage] = useState(1);
    const [orientationPagination, setOrientationPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [applicants, setApplicants] = useState([]);
    const [applicantsPage, setApplicantsPage] = useState(1);
    const [applicantsPagination, setApplicantsPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [openCreateEvent, setOpenCreateEvent] = useState(false);

    const [applicantId, setApplicantId] = useState(null);
    const [openAddToEvent, setOpenAddToEvent] = useState(false);

    const [orientationId, setOrientationId] = useState(null);
    const [openTrackAttendance, setOpenTrackAttendance] = useState(false);
    const [openEditEvent, setOpenEditEvent] = useState(false);
    const [openDeleteEvent, setOpenDeleteEvent] = useState(false);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

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

    const loadTotals = async () => {
        const { success, message, totals } = await fetchOrientationTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadEvents = async () => {
        const { success, message, orientationEvents, pagination: apiOrientationPagination } = await fetchAllOrientationEvent({ page: orientationPage });
        if (success) {
            setOrientations(orientationEvents);
            setOrientationPagination(apiOrientationPagination);
            return
        }
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, applicants, pagination: apiApplicantsPagination } = await fetchAllOrientation({
            search: toSearch,
            companyId,
            page: applicantsPage
        });
        if (success) {
            setApplicants(applicants);
            setApplicantsPagination(apiApplicantsPagination);
            return;
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
            setIsloading(true);
            await Promise.all([
                loadTotals(),
                loadTable(),
                loadEvents()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsloading(false);
        }
    };

    useEffect(() => {
        loadAfter();
        runFetchAllCompany();
    }, []);

    useEffect(() => {
        loadTable();
    }, [companyId]);

    useEffect(() => {
        setApplicantsPage(1);
    }, [toSearch, companyId]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
        loadEvents();
    }, [orientationPage]);

    useEffect(() => {
        loadTable();
    }, [toSearch, companyId, applicantsPage]);

    if (isLoading) return <Loading />

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 grow">

                    {/* admin header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Orientation Management</p>
                            <p className="text-gray-500">Create orientation events and track attendance</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                className="btn rounded-lg"
                                onClick={() => setViewEvent(true)}
                            >
                                <Eye size={16} />
                                <p className="font-semibold text-sm cursor-pointer">View Events</p>
                            </button>
                            <button
                                className="btn bg-emerald-500 text-white rounded-lg"
                                onClick={() => setOpenCreateEvent(true)}
                            >
                                <Plus size={16} />
                                <p className="font-semibold text-sm cursor-pointer">Create Event</p>
                            </button>
                        </div>
                    </section>

                    {/* admin totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Pending Orientation</p>
                                <Users size={16} className="text-purple-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.pendingOrientation}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Attended</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.attended}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Missed</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.missed}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Events</p>
                                <Calendar size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.totalEvents}</p>
                        </div>
                    </section>

                    {viewEvent && (
                        <ModalBackground>
                            <section
                                ref={containerRef}
                                className="relative bg-white border border-gray-300 lg:rounded-xl h-full w-[min(100%,800px)] overflow-auto"
                            >
                                <div className="bg-white z-10 sticky py-4 top-0 left-0 right-0 flex items-center justify-between mb-4 p-4 border-b border-gray-300">
                                    <p className="font-semibold">Scheduled Orientation Events</p>
                                    <div className="flex gap-4">

                                        <Pagination
                                            pagination={orientationPagination}
                                            page={orientationPage}
                                            setPage={setOrientationPage}
                                        />
                                        <button
                                            className="btn btn-square btn-ghost"
                                            onClick={() => setViewEvent(false)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                {orientations.length > 0 ? (
                                    orientations?.map(orientation => (
                                        <div key={orientation?.id} className="border border-gray-300 p-4 rounded-lg mb-4 mx-4">
                                            <div className="flex justify-between flex-wrap gap-4 mb-4">

                                                <p className="text-lg font-semibold">{orientation?.eventTitle}</p>

                                                <div className="flex gap-2 flex-wrap">
                                                    <button
                                                        className="btn btn-ghost border-gray-300"
                                                        onClick={() => handleTrackAttendance(orientation?.id)}
                                                    >
                                                        Track Attendance
                                                    </button>
                                                    <button
                                                        className="btn btn-ghost border-gray-300"
                                                        onClick={() => handleEditEvent(orientation?.id)}
                                                    >
                                                        Edit Event
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex md:items-center justify-between max-md:flex-col gap-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar size={16} />
                                                    {<p className="text-sm">{orientation?.eventAt ? cleanDateTime(orientation?.eventAt) : 'No Schedule Yet'}</p>}
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
                                    ))
                                ) : (
                                    <div className="rounded-lg overflow-hidden">
                                        <NoData message="NO ORIENTATION EVENT FOUND" />
                                    </div>
                                )
                                }
                            </section>
                        </ModalBackground>
                    )}

                    <section className="border border-gray-300 p-4 rounded-xl max-w-full">

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
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

                            <Select
                                placeholder="All Companies"
                                options={selectCompanies?.map(company => ({ value: company.id, name: company.companyName }))}
                                value={companyId}
                                onChange={(e) => setCompanyId(e.target.value)}
                            />
                        </div>

                        {applicants.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Position</th>
                                            <th>Company</th>
                                            <th>Event</th>
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
                                                            {applicant?.user?.applicants?.length > 0 &&
                                                                <div className="flex gap-2 items-center bg-red-500 text-white py-1 px-2 font-semibold text-xs rounded-md w-min">
                                                                    <Ban size={16} />
                                                                    Blacklisted
                                                                </div>
                                                            }
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
                                                    {applicant?.orientationEvent?.eventTitle || '-'}
                                                </td>
                                                <td>
                                                    <div className="flex-center">
                                                        <button
                                                            className="btn btn-sm whitespace-nowrap rounded-xl"
                                                            onClick={() => handleAddToEvent(applicant?.id)}
                                                        >
                                                            <ChevronLeft size={16} />
                                                            {applicant?.orientationId ? 'Change event' : 'Add to event'}
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
                                <NoData message="NO APPLICANT FOUND" />
                            </div>
                        )

                        }
                        <div className="mt-4">
                            <Pagination
                                pagination={applicantsPagination}
                                page={applicantsPage}
                                setPage={setApplicantsPage}
                            />
                        </div>
                    </section>
                </div>
            </div>
            {openCreateEvent &&
                <AddEvent
                    onClose={() => setOpenCreateEvent(false)}
                    loadAfter={loadAfter}
                />
            }

            {openEditEvent &&
                <EditEvent
                    orientationId={orientationId}
                    onClose={() => setOpenEditEvent(false)}
                    loadAfter={loadAfter}
                />
            }

            {openDeleteEvent &&
                <DeleteOrientationEvent
                    orientationId={orientationId}
                    onClose={() => setOpenDeleteEvent(false)}
                    loadAfter={loadAfter}
                />
            }

            {openAddToEvent &&
                <AddToEvent
                    applicantId={applicantId}
                    onClose={() => setOpenAddToEvent(false)}
                    loadAfter={loadAfter}
                />
            }

            {openTrackAttendance &&
                <TrackAttendance
                    orientationId={orientationId}
                    onClose={() => setOpenTrackAttendance(false)}
                    loadAfter={loadAfter}
                />
            }
        </div>
    )
}