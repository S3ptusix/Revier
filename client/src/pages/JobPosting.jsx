/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, RotateCcw, Search, X } from "lucide-react";
import Topbar from "../components/Topbar";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { readJobPosting, readOneJob } from "../services/jobServices";
import ViewJob from "../components/ViewJob";
import Input from "../components/ui/Input";
import Pagination from "../components/Pagination";
import { fetchAllSavedJobList, saveJob } from "../services/userServices";
import Loading from "../components/Loading";
import LocationPicker from "../components/LocationPicker";
import Select from "../components/ui/Select";
import { useNavigate } from 'react-router-dom';
import { locationAutocomplete } from "../services/location";
import { getAddressFromCoords } from "../utils/tools";

export default function JobPosting() {

    const navigate = useNavigate();

    const [textLocation, setTextLocation] = useState('')

    const [viewJobIsLoading, setViewJobIsLoading] = useState(false);

    const [selectedJob, setSelectedJob] = useState('');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [savedJobsList, setSavedJobsList] = useState([]);

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [location, setLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [coords, setCoords] = useState({
        latitude: null,
        longitude: null
    });
    const [radius, setRadius] = useState(10);

    const [type, setType] = useState('');

    const [showJobDetails, setShowJobDetails] = useState(false);

    const [jobs, setJobs] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);

    const handleShowJobDetails = async (jobId) => {
        try {
            setViewJobIsLoading(true);
            setSelectedJob(jobId);
            const { success, job, message } = await readOneJob(jobId);
            if (success) {

                setJobDetails(job);
                setShowJobDetails(true);
                return;
            }
            console.error(message);

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setViewJobIsLoading(false);
            }, 250);
        }
    }
    const readJobs = async () => {
        try {
            const { success, jobs, message, pagination: apiPagination } = await readJobPosting({
                toSearch,
                toLocation,
                type,
                page,
                userLat: coords.latitude,
                userLng: coords.longitude,
                radius
            });
            if (success) {
                setJobs(jobs);
                setPagination(apiPagination);
                return;
            }
            console.error(message);
        } catch (error) {
            console.error(error);
        }

    }

    const handleSaveJob = async (jobId) => {
        try {
            const { success, message } = await saveJob(jobId);

            if (success) return loadSavedJobList();
            if (message === 'Unauthorized') return navigate('/register');

            console.error(message);

        } catch (error) {
            console.error(error);
        }
    }

    const loadSavedJobList = async () => {
        try {
            const { success, message, savedJobsList: apiSavedJobsList } = await fetchAllSavedJobList();
            if (success) return setSavedJobsList(apiSavedJobsList);
            if (message !== 'Unauthorized') return console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleResetNearMe = async () => {
        const resetRadius = 10;

        const resetCoords = {
            latitude: null,
            longitude: null
        };

        setRadius(resetRadius);
        setCoords(resetCoords);

        setTextLocation('');

        // readJobs();
    };

    useEffect(() => {
        loadSavedJobList();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [toSearch, toLocation, type]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        readJobs();
    }, [toSearch, toLocation, type, page]);

    useEffect(() => {
        try {
            const loadLocation = async () => {
                if (coords.latitude || coords.longitude) {
                    const thisLocation = await getAddressFromCoords(coords.latitude, coords.longitude);
                    setTextLocation(thisLocation);
                }
            }
            loadLocation();
        } catch (error) {
            console.error(error);
        }
    }, [coords.latitude, coords.longitude]);

    return (
        <div>
            <Topbar />
            <div className="md:px-[15vw] max-md:px-4">
                <section className="mb-6 space-y-4">

                    {/* LOCATION CARD */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

                        <div className="relative">
                            <LocationPicker
                                coords={coords}
                                setFormData={setCoords}
                                radius={radius}
                            />

                            {textLocation && (
                                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
                                    📍 {textLocation}
                                </div>
                            )}
                        </div>

                        {/* CONTROLS */}
                        <div className="flex flex-col md:flex-row gap-2 p-3 bg-gray-50">

                            {/* RADIUS */}
                            <div className="flex-1">
                                <Select
                                    value={radius}
                                    options={[
                                        { name: '5 km radius', value: 5 },
                                        { name: '10 km radius', value: 10 },
                                        { name: '20 km radius', value: 20 },
                                        { name: '50 km radius', value: 50 },
                                    ]}
                                    onChange={(e) => setRadius(e.target.value)}
                                />
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-2 w-full md:w-auto">

                                {/* APPLY BUTTON (PRIMARY) */}
                                <button
                                    className="flex-1 md:flex-none btn bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg flex items-center justify-center gap-2"
                                    onClick={readJobs}
                                >
                                    Apply Location
                                </button>

                                {/* RESET BUTTON (SECONDARY) */}
                                <button
                                    className="btn bg-white text-gray-500 hover:text-emerald-500 border border-gray-200 rounded-lg flex items-center gap-2"
                                    onClick={handleResetNearMe}
                                >
                                    <RotateCcw size={16} />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* SEARCH + FILTER */}
                    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">

                        <div className="flex gap-2 flex-wrap">

                            {/* SEARCH */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg flex-1 min-w-50">
                                {/* <Search size={16} className="text-gray-400" /> */}
                                <input
                                    type="text"
                                    placeholder="Search jobs, company, location..."
                                    className="pl-3 bg-transparent outline-none w-full py-2 text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn rounded-l-none rounded-r-lg bg-white text-gray-500 hover:text-emerald-500"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                </button>
                            </div>

                            {/* TYPE FILTER */}
                            <div className="w-45">
                                <Select
                                    value={type}
                                    options={[
                                        { name: 'All Types', value: '' },
                                        { name: 'Full-Time', value: 'Full-Time' },
                                        { name: 'Part-Time', value: 'Part-Time' },
                                        { name: 'Contract', value: 'Contract' },
                                        { name: 'Internship', value: 'Internship' },
                                    ]}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </div>

                            {/* RESET ALL */}
                            {(search || type || textLocation) && (
                                <button
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
                                    onClick={() => {
                                        setSearch('');
                                        setToSearch('');
                                        setType('');
                                        handleResetNearMe();
                                    }}
                                >
                                    <X size={14} />
                                    Clear
                                </button>
                            )}

                        </div>

                        {/* ACTIVE FILTERS (UX BOOST) */}
                        <div className="flex gap-2 flex-wrap">
                            {search && (
                                <span className="filter-chip mt-3">
                                    🔍 {search}
                                </span>
                            )}
                            {type && (
                                <span className="filter-chip mt-3">
                                    💼 {type}
                                </span>
                            )}
                            {textLocation && (
                                <span className="filter-chip mt-3">
                                    📍 {textLocation}
                                </span>
                            )}
                        </div>

                    </div>
                </section>

                <section>
                    <p className="text-sm text-gray-500 mb-8">Showing <span className="font-semibold text-black">{pagination.total} {pagination.total > 1 ? 'jobs' : 'job'}</span></p>
                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <div className="grid gap-4 mb-4">
                                {jobs.length > 0 ? (
                                    jobs.map(job => (
                                        <Card
                                            key={job.id}
                                            job={job}
                                            showDetails={(id) => {
                                                handleShowJobDetails(id);
                                            }}
                                            handleSaveJob={(jobId) => handleSaveJob(jobId)}
                                            savedJobsList={savedJobsList}
                                            selectedJob={selectedJob}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No jobs found</p>
                                )
                                }
                            </div>
                            <div className="my-4">
                                <Pagination
                                    pagination={pagination}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </div>
                        <div>
                            {showJobDetails ? (
                                viewJobIsLoading ? (
                                    <div className={`max-lg:fixed max-lg:inset-0 sticky top-4 h-[calc(100vh-2rem)] border border-emerald-500 bg-gray-50 rounded-lg p-4 max-lg:z-999 overflow-auto ${showJobDetails} duration-200`}>
                                        <Loading />
                                    </div>
                                ) : (
                                    <ViewJob
                                        job={jobDetails}
                                        show={showJobDetails}
                                        handleSaveJob={(jobId) => handleSaveJob(jobId)}
                                        savedJobsList={savedJobsList}
                                        onClose={() => setShowJobDetails(false)}
                                    />
                                )
                            ) : (
                                <div className="max-lg:fixed max-lg:inset-0 sticky top-4 h-[calc(100vh-2rem)] flex-center flex-col gap-4 border border-emerald-500 bg-gray-50 rounded-lg p-8 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                                    <div className="w-20 h-20 rounded-full bg-white flex-center shadow-sm">
                                        <Briefcase size={32} className="text-emerald-500" strokeWidth={1.5} />
                                    </div>

                                    <div className="text-center max-w-xs">
                                        <p className="text-gray-700 font-medium mb-1">No job selected</p>
                                        <p className="text-gray-400 text-sm">
                                            Choose a listing from the panel to view its full details here.
                                        </p>
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}