/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import Topbar from "../components/Topbar";
import { Briefcase, FileText, SquarePen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { readOneJob } from "../services/jobServices";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import ApplicationCard from "../components/ApplicationCard";
import { logoutUser } from "../services/authServices";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { fetchAllSavedJobs, fetchRecentApplications, fetchAllSavedJobList, saveJob } from "../services/userServices";
import EditApplication from "../components/EditApplication";
import Pagination from "../components/Pagination";
import ApplicantDetails from "../components/ApplicantDetails";

export default function Dashboard() {

    const { user, setUser } = useContext(UserContext);

    const [savedJobsList, setSavedJobsList] = useState([]);

    const navigate = useNavigate();

    const [showJobDetails, setShowJobDetails] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    const [applicationId, setApplicationId] = useState(null);
    const [showEditApplication, setShowEditApplication] = useState(false);


    const [recentApplications, setRecentApplications] = useState([]);
    const [pageRecentApplications, setPageRecentApplications] = useState(1);
    const [paginationRecentApplications, setPaginationRecentApplications] = useState({
        total: 0,
        totalPages: 1,
    });

    const [savedJobs, setSavedJobs] = useState([]);
    const [pageSavedJobs, setPageSavedJobs] = useState(1);
    const [paginationSavedJobs, setPaginationSavedJobs] = useState({
        total: 0,
        totalPages: 1,
    });

    const [viewApplicationDetail, setViewApplicationDetail] = useState(false);

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

    const handleLogout = async () => {
        try {
            const { success } = await logoutUser();
            if (success) {
                setUser(null);
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    const handleShowEditApplication = (applicationId) => {
        setApplicationId(applicationId);
        setShowEditApplication(true);
    }

    const loadSavedJobList = async () => {
        try {
            const { success, message, savedJobsList: apiSavedJobsList } = await fetchAllSavedJobList();
            if (success) return setSavedJobsList(apiSavedJobsList);
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSaveJob = async (jobId) => {
        try {
            const { success, message } = await saveJob(jobId);

            if (success) {
                if ((paginationSavedJobs.total - 1) <= 5) {
                    console.log('true');
                    setPageSavedJobs(1);
                    loadSavedJobs();
                } else {
                    loadSavedJobs();
                }
                return
            };
            console.error(message);

        } catch (error) {
            console.error(error);
        }
    }

    const loadSavedJobs = async () => {
        try {
            const { success, message, savedJobs: apiSavedJobs, pagination: apiPaginationRecentApplication } = await fetchAllSavedJobs({ page: pageSavedJobs });
            if (success) {
                setSavedJobs(apiSavedJobs);
                setPaginationSavedJobs(apiPaginationRecentApplication);
                return
            }
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleViewApplicantDetails = (applicationId) => {
        setApplicationId(applicationId);
        setViewApplicationDetail(true);
    }

    useEffect(() => {
        try {
            const loadRecentApplications = async () => {
                const { success, message, recentAppilcations: apiRecentApplications, pagination: apiPaginationRecentApplication } = await fetchRecentApplications({ page: pageRecentApplications });
                if (success) {
                    setRecentApplications(apiRecentApplications);
                    setPaginationRecentApplications(apiPaginationRecentApplication);
                    return
                }
                console.error(message);
            }
            loadRecentApplications();
        } catch (error) {
            console.error(error);
        }
    }, [pageRecentApplications]);


    useEffect(() => {
        loadSavedJobs();
    }, [pageSavedJobs]);

    useEffect(() => {
        loadSavedJobList();
    }, []);

    return (
        <div className="flex flex-col max-h-screen">
            <Topbar />
            <div className="grow overflow-auto">
                <section className="grid lg:grid-cols-2 gap-4 bg-emerald-500 py-8 px-[10vw] mb-8">
                    <div className="text-white flex items-center gap-4">
                        <div className="max-lg:hidden h-25 flex-center aspect-square rounded-full bg-emerald-600">
                            <p className="text-5xl">👤</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold mb-2">Welcome back, {user?.fullname}!</p>
                            {/* <p>Product Designer • San Francisco, CA</p> */}
                        </div>
                    </div>
                    <div className="flex items-center lg:justify-end gap-2">
                        <Link to="/profile">
                            <button className="btn bg-white rounded-lg">
                                <SquarePen size={16} />
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </section>

                <div className="grid lg:flex gap-8 mx-[10vw] pb-8">
                    <div className="lg:grow">
                        <section className="rounded-xl border border-gray-200 p-4 mb-8">
                            <div className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap mb-4">
                                <p className="text-xl font-semibold">Recent Applications</p>
                            </div>
                            <div className="grid gap-4">
                                {recentApplications.length > 0 ? (
                                    recentApplications.map(application => (
                                        <ApplicationCard
                                            key={application.id}
                                            application={application}
                                            handleShowEditApplication={(jobId) => handleShowEditApplication(jobId)}
                                            handleViewApplicantDetails={(jobId) => handleViewApplicantDetails(jobId)}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No jobs found</p>
                                )
                                }
                            </div>
                            <div className="mt-4">
                                <Pagination
                                    pagination={paginationRecentApplications}
                                    page={pageRecentApplications}
                                    setPage={setPageRecentApplications}
                                />
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap mb-4">
                                <p className="text-xl font-semibold">Saved Jobs</p>
                            </div>
                            <div className="grid gap-4">
                                {savedJobs.length > 0 ? (
                                    savedJobs.map(job => (
                                        <Card
                                            key={job.id}
                                            job={job}
                                            showDetails={(applicationId) => {
                                                handleShowJobDetails(applicationId);
                                            }}
                                            handleSaveJob={(jobId) => handleSaveJob(jobId)}
                                            savedJobsList={savedJobsList}
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center">No jobs found</p>
                                )
                                }
                            </div>
                            <div className="mt-4">
                                <Pagination
                                    pagination={paginationSavedJobs}
                                    page={pageSavedJobs}
                                    setPage={setPageSavedJobs}
                                />
                            </div>
                        </section>
                    </div>

                    <div className="lg:w-85">
                        <div className="rounded-xl border border-gray-200 p-4 mb-8">
                            <p className="text-lg font-semibold mb-2">Quick Actions</p>
                            <Link to={'/jobposting'}>
                                <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg w-full mb-2 cursor-pointer">
                                    <div className="p-2 bg-emerald-100 text-emerald-500 rounded-lg">
                                        <Briefcase />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">Browse Jobs</p>
                                        <p className="text-xs text-gray-400 font-normal">Find new opportunities</p>
                                    </div>
                                </button>
                            </Link>

                            <Link to={'/profile'}>
                                <button className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg w-full mb-2 cursor-pointer">
                                    <div className="p-2 bg-blue-100 text-blue-500 rounded-lg">
                                        <FileText />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-sm">Update Resume</p>
                                        <p className="text-xs text-gray-400 font-normal">Keep profile current</p>
                                    </div>
                                </button>
                            </Link>
                        </div>

                        <div className="flex flex-col rounded-xl border border-gray-200 p-4">
                            <p className="text-lg font-semibold mb-2">Account Settings</p>


                            <button className="w-fit font-semibold cursor-pointer mb-2">
                                Change Password
                            </button>
                            <button
                                className="w-fit font-semibold cursor-pointer text-red-500"
                                onClick={handleLogout}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showEditApplication && (
                <EditApplication
                    applicantId={applicationId}
                    onClose={() => setShowEditApplication(false)}
                />
            )}

            {viewApplicationDetail && (
                <ApplicantDetails
                    applicationId={applicationId}
                    onClose={() => setViewApplicationDetail(false)}
                />
            )}
        </div>
    )
}