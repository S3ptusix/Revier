/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, RotateCcw, Search } from "lucide-react";
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
                <section className="mb-4 space-y-4 py-8">
                    <div className="relative rounded-lg overflow-hidden">
                        <LocationPicker
                            coords={coords}
                            setFormData={setCoords}
                            radius={radius}
                        />
                        {textLocation && (
                            <p className="absolute m-2 top-0 right-0 font-semibold bg-blue-500 text-white py-1 px-2 rounded-lg">{textLocation}</p>
                        )}
                        <div className="grid md:grid-cols-2 gap-2 bg-gray-300 p-2">
                            <Select
                                value={radius}
                                options={[
                                    { name: 'Within 5km', value: 5 },
                                    { name: 'Within 10km', value: 10 },
                                    { name: 'Within 20km', value: 20 },
                                    { name: 'Within 50km', value: 50 },
                                ]}
                                onChange={(e) => setRadius(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    className="grow btn bg-emerald-500 text-white border-0 rounded-lg"
                                    onClick={readJobs}
                                >
                                    Apply Location
                                </button>
                                <div className="tooltip" data-tip="Reset">
                                    <button
                                        className="btn rounded-lg text-emerald-500"
                                        onClick={handleResetNearMe}
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-2 border border-gray-300 rounded-xl">
                        <div className="flex gap-4 flex-wrap">
                            <div className="flex gap-2 input-search-container grow">
                                <div className="grow">
                                    <Input
                                        placeholder="Job title, Company, Education, Experience"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                {/* <div className="grow">
                                    <Input
                                        placeholder="Location..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div> */}
                                <button
                                    className="btn bg-emerald-500 text-white rounded-lg"
                                    onClick={() => {
                                        setToSearch(search);
                                        setToLocation(location);
                                    }}
                                >
                                    <Search size={16} />
                                    <p className="max-md:hidden">Search</p>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-50">
                            <Select
                                value={type}
                                options={[
                                    { name: 'All Job Type', value: '' },
                                    { name: 'Full-Time', value: 'Full-Time' },
                                    { name: 'Part-Time', value: 'Part-Time' },
                                    { name: 'Contract', value: 'Contract' },
                                    { name: 'Internship', value: 'Internship' },
                                ]}
                                onChange={(e) => setType(e.target.value)}
                            />
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
                                <div className="max-lg:fixed max-lg:inset-0 sticky top-4 h-[calc(100vh-2rem)] flex-center flex-col border border-emerald-500 bg-gray-50 rounded-lg p-4 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                                    <p className="font-bold text-3xl text-emerald-500">SELECT A JOB</p>
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