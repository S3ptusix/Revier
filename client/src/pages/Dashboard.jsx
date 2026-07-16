/* eslint-disable react-hooks/exhaustive-deps */
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
import { sendOtp } from "../services/otpServices";
import VerifyEmail from "../components/VerifyEmail";
import ChangePassword from "../components/ChangePassword";
import { toast } from "react-toastify";
import ViewJobModal from "../components/ViewJobModal";

export default function Dashboard() {

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);

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
                navigate('/home');
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

    const handleChangePassword = async () => {
        try {
            const { success, message } = await sendOtp();
            if (success) {
                setOpenVerifyEmail(true);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
        }
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
        <div className="flex flex-col">
            <Topbar />
            <div>
                <section className="flex justify-center items-center bg-emerald-500 py-10 md:px-[10vw] max-md:px-4 mb-8">
                    <p className="text-white text-4xl font-bold mb-2">DASHBOARD</p>
                </section>

                <div className="grid lg:flex gap-8 md:mx-[10vw] max-md:mx-4 pb-8">
                    <div className="lg:grow">
                        <section className="rounded-xl border border-gray-300 p-4 mb-8">
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

                        <section className="rounded-xl border border-gray-300 p-4">
                            <div className="flex items-center justify-between gap-x-4 gap-y-2 flex-wrap mb-4">
                                <p className="text-xl font-semibold">Saved Jobs</p>
                            </div>
                            <div className="grid gap-4">
                                {savedJobs?.length > 0 ? (
                                    savedJobs?.map(job => (
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
                        <div className="rounded-xl border border-gray-300 p-4">
                            <p className="text-lg font-semibold mb-2">Settings</p>
                            <div className="grid space-y-2">
                                <Link to="/profile">
                                    <button className="btn rounded-lg w-full">
                                        Edit Profile
                                    </button>
                                </Link>
                                <button
                                    className="btn rounded-lg"
                                    onClick={handleChangePassword}
                                >
                                    Change Password
                                </button>
                                <button
                                    className="btn rounded-lg bg-red-500/25 text-red-500"
                                    onClick={handleLogout}
                                >
                                    Sign out
                                </button>
                            </div>
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
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={user.email}
                    successFunction={() => setOpenChangePassword(true)}
                />
            )}
            {openChangePassword && (
                <ChangePassword
                    onClose={() => setOpenChangePassword(false)}
                />
            )}

            {showJobDetails && (
                <ViewJobModal
                    job={jobDetails}
                    handleSaveJob={(jobId) => handleSaveJob(jobId)}
                    savedJobsList={savedJobsList}
                    onClose={() => setShowJobDetails(false)}
                />
            )}
        </div>
    )
}