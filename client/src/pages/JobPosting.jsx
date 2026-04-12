/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, ChevronsLeft, ChevronsRight, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import Card from "../components/Card";
import { useEffect } from "react";
import { readJobPosting, readOneJob } from "../services/jobServices";
import ViewJob from "../components/ViewJob";
import Input from "../components/ui/Input";
import Pagination from "../components/Pagination";

export default function JobPosting() {

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

    const [location, setLocation] = useState('');
    const [toLocation, setToLocation] = useState('');

    const [type, setType] = useState('');

    const [showJobDetails, setShowJobDetails] = useState(false);

    const [jobs, setJobs] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);

    const handleShowJobDetails = async (jobId) => {
        try {
            const { success, job, message } = await readOneJob(jobId);
            if (success) {
                setJobDetails(job);
                setShowJobDetails(true);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error(error);
        }
    }
    const readJobs = async () => {
        try {
            const { success, jobs, message, pagination: apiPagination } = await readJobPosting({
                toSearch,
                toLocation,
                type,
                page
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

    return (
        <div>
            <Topbar />
            <div>
                <div className="bg-emerald-500 py-8 px-[10vw]">
                    <div className="flex items-center gap-2 text-white mb-4">
                        <Briefcase size={32} className="shrink-0" />
                        <p className="font-bold text-2xl">Find Your Next Job</p>
                    </div>
                    <p className="text-white text-lg">Browse through {jobs.length}+ job openings and find your perfect match</p>
                </div>
                <section className="py-8 px-[10vw]">
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex gap-4 flex-wrap border-b border-gray-200 pb-4 mb-4">
                            <div className="flex gap-2 input-search-container grow">
                                <div className="grow">
                                    <Input
                                        placeholder="Search Companies..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="grow">
                                    <Input
                                        placeholder="Location..."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
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
                        <div className="flex gap-4 flex-wrap">
                            <button
                                className={`btn btn-ghost rounded-lg ${type === '' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Full-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Full-Time')}
                            >
                                Full-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Part-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Part-Time')}
                            >
                                Part-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Contract' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Contract')}
                            >
                                Contact
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${type === 'Internship' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setType('Internship')}
                            >
                                Internship
                            </button>
                        </div>
                    </div>
                </section>

                <section className="px-[10vw]">
                    <p className="text-sm text-gray-500 mb-8">Showing <span className="font-semibold text-black">{jobs.length} {jobs.length > 1 ? 'jobs' : 'job'}</span></p>
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
                            {showJobDetails ?
                                <ViewJob
                                    job={jobDetails}
                                    show={showJobDetails}
                                    onClose={() => setShowJobDetails(false)}
                                />
                                :
                                <div className="max-lg:fixed max-lg:inset-0 sticky top-0 h-screen flex-center flex-col bg-white border border-emerald-500 rounded-xl p-4 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                                    <p className="font-bold text-3xl text-emerald-500">SELECT A JOB</p>
                                </div>
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}