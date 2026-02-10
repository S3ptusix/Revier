/* eslint-disable no-unused-vars */
import { Award, ArrowLeft, Bookmark, Briefcase, Building2, ChevronsLeft, ChevronsRight, CircleCheckBig, Clock, GraduationCap, MapPin, Search } from "lucide-react";
import Topbar from "../components/Topbar";
import { useState } from "react";
import { industries } from "../utils/data";
import Card from "../components/Card";
import { useEffect } from "react";
import { readJobPosting, readOneJob } from "../services/jobServices";
import { formatPostedDate } from "../utils/format";

export default function JobPosting() {

    const [showJobDetails, setShowJobDetails] = useState(false);

    const [employmentType, setEmploymentType] = useState('');

    const [jobs, setJobs] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);

    const responsibilities = [
        "Lead design projects from concept to launch",
        "Create wireframes, prototypes, and high-fidelity designs",
        "Conduct user research and usability testing",
        "Collaborate with cross-functional teams",
        "Mentor junior designers",
        "Define and maintain design systems",
    ];

    const requirements = [
        "5+ years of experience in product design",
        "Strong portfolio showcasing user-centered design",
        "Proficiency in Figma and other design tools",
        "Excellent communication and collaboration skills",
        "Experience with design systems",
        "Understanding of front-end development principles",
    ];

    const benefitsAndPerks = [
        "Competitive salary and equity",
        "Health, dental, and vision insurance",
        "Flexible work schedule",
        "Remote work options",
        "Professional development budget",
        "Gym membership",
        "401(k) matching",
        "Unlimited PTO",
    ];

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
                            {jobDetails ? (
                                <div className={`max-lg:fixed max-lg:inset-0 sticky top-0 h-screen bg-white border border-gray-200 rounded-xl p-4 max-lg:z-999 overflow-auto ${showJobDetails ? 'max-lg:opacity-100' : 'max-lg:opacity-0 max-lg:pointer-events-none'} duration-200`}>
                                    <button
                                        className="lg:hidden flex items-center gap-2 cursor-pointer mb-8"
                                        onClick={() => setShowJobDetails(false)}
                                    >
                                        <ArrowLeft className="text-emerald-500" />
                                        <p className="font-semibold">Back to jobs</p>
                                    </button>
                                    <button className="btn btn-square btn-ghost rounded-lg absolute top-4 right-4">
                                        <Bookmark />
                                    </button>

                                    <div className="flex gap-4 mb-4">
                                        <div className="p-4 rounded-lg bg-gray-200 text-gray-500 h-fit w-fit">
                                            <Building2 size={32} className="shrink-0" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-bold">{jobDetails?.jobTitle}</p>
                                            <p className="text-gray-500 mb-4">{jobDetails?.company?.companyName}</p>
                                            <div className="flex gap-2">
                                                <span className="bg-emerald-100 text-emerald-500 rounded-full px-4 py-1 text-sm">{jobDetails?.type}</span>
                                                <span className="flex gap-2 items-center text-gray-500 text-sm">
                                                    <Clock size={16} /> {formatPostedDate(jobDetails?.postedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 flex-wrap items-center mb-8">
                                        <div className="flex-1 flex items-center gap-2 min-w-50">
                                            <MapPin className="text-gray-500 shrink-0" size={16} />
                                            <div>
                                                <p className="text-gray-500 text-xs">Location</p>
                                                <p className="text-sm font-semibold">{jobDetails?.company?.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-center gap-2 min-w-50">
                                            <GraduationCap className="text-gray-500 shrink-0" size={16} />
                                            <div>
                                                <p className="text-gray-500 text-xs">Education</p>
                                                <p className="text-sm font-semibold">{jobDetails?.education}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex items-center gap-2 min-w-50">
                                            <Award className="text-gray-500 shrink-0" size={16} />
                                            <div>
                                                <p className="text-gray-500 text-xs">Experience</p>
                                                <p className="text-sm font-semibold">{jobDetails?.experience}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xl font-semibold mb-4">Job Description</p>
                                    <p className="whitespace-pre-line text-gray-500 mb-8">{jobDetails?.description}</p>

                                    {(jobDetails?.responsibilities?.length > 0) &&
                                        <>
                                            <p className="text-xl font-semibold mb-4">Responsibilities</p>
                                            <div className="flex flex-col gap-2 mb-8">
                                                {jobDetails?.responsibilities.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                                        <p className="text-gray-500">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    }
                                    {(jobDetails?.requirements?.length > 0) &&
                                        <>
                                            <p className="text-xl font-semibold mb-4">Requirements</p>
                                            <div className="flex flex-col gap-2 mb-8">
                                                {jobDetails?.requirements.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                                        <p className="text-gray-500">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    }
                                    {(jobDetails?.benefitsAndPerks?.length > 0) &&
                                        <>
                                            <p className="text-xl font-semibold mb-4">Benefits & Perks</p>
                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                {jobDetails?.benefitsAndPerks.map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                                        <p className="text-gray-500">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    }
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="btn rounded-lg bg-emerald-500 text-white">
                                            Apply Now
                                        </button>
                                        <button className="btn roundded-lg">
                                            <Bookmark size={16} />
                                            Save Job
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-lg:fixed max-lg:inset-0 sticky top-0 h-screen flex-center flex-col bg-white border border-gray-200 rounded-xl p-4 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                                    <Briefcase size={64} className="text-gray-200" />
                                    <p className="text-gray-500 text-lg">Select a job to see details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}