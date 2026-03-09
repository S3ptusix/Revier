import { Briefcase, ChevronsLeft, ChevronsRight, MapPin, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import { industries } from "../utils/data";
import Card from "../components/Card";
import { useEffect } from "react";
import { readJobPosting, readOneJob } from "../services/jobServices";
import ViewJob from "../components/viewJob";

export default function JobPosting() {

    const [showJobDetails, setShowJobDetails] = useState(false);

    const [employmentType, setEmploymentType] = useState('');

    const [jobs, setJobs] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);

    const handleShowJobDetails = async (id) => {
        try {
            const { success, job, message } = await readOneJob(id);
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

    useEffect(() => {
        try {
            const readJobs = async () => {
                const { success, jobs, message } = await readJobPosting();
                if (success) {
                    setJobs(jobs);
                } else {
                    console.error(message);
                }
            }
            readJobs();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <div>
            <Topbar />
            <div>
                <div className="bg-emerald-500 py-8 px-[10vw]">
                    <div className="flex items-center gap-2 text-white mb-4">
                        <Briefcase size={32} />
                        <p className="font-bold text-2xl">Find Your Next Job</p>
                    </div>
                    <p className="text-white text-lg">Browse through {jobs.length}+ job openings and find your perfect match</p>
                </div>
                <section className="py-8 px-[10vw]">
                    <div className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex gap-4 flex-wrap border-b border-gray-200 pb-4 mb-4">
                            <div className="flex-2 min-w-50 md:min-w-100 flex items-center bg-gray-100 rounded-lg">
                                <Search className="text-gray-500 ml-2" />
                                <input
                                    type="text"
                                    placeholder="Seach by title, company, or keywords..."
                                    className="input border-0 outline-0 shadow-none bg-transparent"
                                />
                            </div>

                            <div className="flex-1 min-w-50 flex items-center bg-gray-100 rounded-lg">
                                <MapPin className="text-gray-500 ml-2" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    className="input border-0 outline-0 shadow-none bg-transparent"
                                />
                            </div>
                            <select
                                className="flex-1 min-w-50 select rounded-lg border-0 outline-0 bg-gray-100"
                            >
                                <option value="">Select Industry</option>
                                {industries.map((industry, index) => (
                                    <option key={index} value={industry.value}>{industry.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                className={`btn btn-ghost rounded-lg ${employmentType === '' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setEmploymentType('')}
                            >
                                All Jobs
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${employmentType === 'Full-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setEmploymentType('Full-Time')}
                            >
                                Full-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${employmentType === 'Part-Time' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setEmploymentType('Part-Time')}
                            >
                                Part-Time
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${employmentType === 'Contract' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setEmploymentType('Contract')}
                            >
                                Contact
                            </button>
                            <button
                                className={`btn btn-ghost rounded-lg ${employmentType === 'Internship' ? 'bg-emerald-500 text-white' : ''}`}
                                onClick={() => setEmploymentType('Internship')}
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
                            <div className="flex justify-center gap-2">
                                <button className="btn btn-square">
                                    <ChevronsLeft size={16} />
                                </button>
                                <button className="btn btn-square">
                                    1
                                </button>
                                <button className="btn btn-square">
                                    2
                                </button>
                                <button className="btn btn-square">
                                    3
                                </button>
                                <button className="btn btn-square">
                                    <ChevronsRight size={16} />
                                </button>
                            </div>
                        </div>
                        <div>
                            <ViewJob
                                job={jobDetails}
                                show={showJobDetails}
                                onClose={() => setShowJobDetails(false)}
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}