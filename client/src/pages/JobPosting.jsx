/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, RotateCcw, Search, X, MapPin, SlidersHorizontal } from "lucide-react";
import TopBar from "../components/TopBar";
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

    const [loadingJobs, setLoadingJobs] = useState(true);

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

    const hasActiveFilters = Boolean(search || type || textLocation);

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
            setLoadingJobs(true);
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
        } finally {
            setLoadingJobs(false);
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

    const handleClearAll = () => {
        setSearch('');
        setToSearch('');
        setType('');
        handleResetNearMe();
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
        <div className="min-h-screen bg-gray-50/50">
            <TopBar />
            {loadingJobs ? (
                <div className="md:px-[15vw] max-md:px-4 pt-4 pb-12">
                    <section className="mb-6 space-y-3">
                        <div className="skeleton h-80 w-full"></div>
                        <div className="skeleton h-20 w-full"></div>
                    </section>
                    <section className="grid lg:grid-cols-2 gap-4">
                        <div className="grid gap-4">
                            <div className="skeleton h-20"></div>
                            <div className="skeleton h-20"></div>
                            <div className="skeleton h-20"></div>
                        </div>
                        <div className="max-lg:hidden skeleton h-full"></div>
                    </section>
                </div>
            ) : (
                <div className="md:px-[15vw] max-md:px-4 pt-4 pb-12">

                    <section className="mb-6 space-y-3">

                        {/* LOCATION CARD */}
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                            <div className="relative">
                                <LocationPicker
                                    coords={coords}
                                    setFormData={setCoords}
                                    radius={radius}
                                />

                                {textLocation && (
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm">
                                        <MapPin size={12} className="shrink-0" />
                                        <span className="max-w-50 truncate">{textLocation}</span>
                                    </div>
                                )}
                            </div>

                            {/* CONTROLS */}
                            <div className="flex flex-col md:flex-row gap-2 p-3 bg-gray-50 border-t border-gray-100">

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
                                        className="flex-1 md:flex-none btn bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors shadow-sm shadow-emerald-500/20"
                                        onClick={readJobs}
                                    >
                                        <MapPin size={16} />
                                        Apply Location
                                    </button>

                                    {/* RESET BUTTON (SECONDARY) */}
                                    <button
                                        className="btn bg-white text-gray-500 hover:text-emerald-600 hover:border-emerald-300 border border-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                                        onClick={handleResetNearMe}
                                    >
                                        <RotateCcw size={16} />
                                        <span className="hidden sm:inline">Reset</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* SEARCH + FILTER */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">

                            <div className="flex gap-2 flex-wrap">

                                {/* SEARCH */}
                                <div className="flex items-center gap-2 bg-gray-100 focus-within:ring-2 focus-within:ring-emerald-500/40 rounded-lg flex-1 min-w-50 transition-shadow">
                                    <Search size={16} className="text-gray-400 ml-3 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search jobs, company, location..."
                                        className="bg-transparent outline-none w-full py-2.5 text-sm placeholder:text-gray-400"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && setToSearch(search)}
                                    />
                                    {search && (
                                        <button
                                            className="text-gray-400 hover:text-gray-600 mr-1 shrink-0"
                                            onClick={() => { setSearch(''); setToSearch(''); }}
                                            aria-label="Clear search"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                    <button
                                        className="btn rounded-l-none rounded-r-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors px-4"
                                        onClick={() => setToSearch(search)}
                                    >
                                        <Search size={16} />
                                    </button>
                                </div>

                                {/* TYPE FILTER */}
                                <div className="w-45 max-sm:w-full">
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
                                {hasActiveFilters && (
                                    <button
                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 px-2 transition-colors"
                                        onClick={handleClearAll}
                                    >
                                        <X size={14} />
                                        Clear all
                                    </button>
                                )}

                            </div>

                            {/* ACTIVE FILTERS (UX BOOST) */}
                            {hasActiveFilters && (
                                <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                                    {search && (
                                        <span className="filter-chip inline-flex items-center gap-1.5">
                                            🔍 {search}
                                            <button
                                                onClick={() => { setSearch(''); setToSearch(''); }}
                                                className="hover:text-red-500"
                                                aria-label="Remove search filter"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    )}
                                    {type && (
                                        <span className="filter-chip inline-flex items-center gap-1.5">
                                            💼 {type}
                                            <button
                                                onClick={() => setType('')}
                                                className="hover:text-red-500"
                                                aria-label="Remove type filter"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    )}
                                    {textLocation && (
                                        <span className="filter-chip inline-flex items-center gap-1.5">
                                            📍 {textLocation}
                                            <button
                                                onClick={handleResetNearMe}
                                                className="hover:text-red-500"
                                                aria-label="Remove location filter"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-black">{pagination.total}</span> {pagination.total === 1 ? 'job' : 'jobs'} found
                            </p>
                        </div>

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
                                        <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 bg-white border border-dashed border-gray-200 rounded-2xl text-center">
                                            <div className="w-14 h-14 rounded-full bg-gray-50 flex-center">
                                                <Briefcase size={24} className="text-gray-300" strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 font-medium mb-1">No jobs found</p>
                                                <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
                                            </div>
                                            {hasActiveFilters && (
                                                <button
                                                    onClick={handleClearAll}
                                                    className="text-sm text-emerald-600 font-medium hover:text-emerald-700 mt-1"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
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
                                        <div className={`max-lg:fixed max-lg:inset-0 sticky top-4 h-[calc(100vh-2rem)] border border-emerald-500 bg-gray-50 rounded-xl p-4 max-lg:z-999 overflow-auto ${showJobDetails} duration-200`}>
                                            <Loading />
                                        </div>
                                    ) : (
                                        <ViewJob
                                            job={jobDetails}
                                            handleSaveJob={(jobId) => handleSaveJob(jobId)}
                                            savedJobsList={savedJobsList}
                                            onClose={() => setShowJobDetails(false)}
                                        />
                                    )
                                ) : (
                                    <div className="max-lg:fixed max-lg:inset-0 sticky top-4 h-[calc(100vh-2rem)] flex-center flex-col gap-4 border border-dashed border-gray-300 bg-white rounded-xl p-8 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex-center">
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
            )}
        </div>
    )
}