/* eslint-disable react-hooks/exhaustive-deps */
import Topbar from "../components/Topbar";
import {
    FileText,
    Bookmark,
    Globe,
    KeyRound,
    Linkedin,
    LogOut,
    Pencil,
    Phone,
    User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { readOneJob } from "../services/jobServices";
import { useEffect, useState, useContext } from "react";
import Card from "../components/Card";
import ApplicationCard from "../components/ApplicationCard";
import { logoutUser } from "../services/authServices";
import { UserContext } from "../context/AuthProvider";
import {
    fetchAllSavedJobs,
    fetchRecentApplications,
    fetchAllSavedJobList,
    saveJob
} from "../services/userServices";
import EditApplication from "../components/EditApplication";
import Pagination from "../components/Pagination";
import ApplicantDetails from "../components/ApplicantDetails";
import { sendOtp } from "../services/otpServices";
import VerifyEmail from "../components/VerifyEmail";
import ChangePassword from "../components/ChangePassword";
import { toast } from "react-toastify";
import ViewJobModal from "../components/ViewJobModal";
import EditProfile from "../components/EditProfile"

export default function Dashboard() {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    // ---------------- STATE ----------------
    const [activeTab, setActiveTab] = useState("applications");

    const [savedJobsList, setSavedJobsList] = useState([]);

    const [jobDetails, setJobDetails] = useState(null);
    const [showJobDetails, setShowJobDetails] = useState(false);

    const [applicationId, setApplicationId] = useState(null);
    const [showEditApplication, setShowEditApplication] = useState(false);
    const [viewApplicationDetail, setViewApplicationDetail] = useState(false);

    const [recentApplications, setRecentApplications] = useState([]);
    const [pageRecentApplications, setPageRecentApplications] = useState(1);
    const [paginationRecentApplications, setPaginationRecentApplications] = useState({ total: 0, totalPages: 1 });

    const [savedJobs, setSavedJobs] = useState([]);
    const [pageSavedJobs, setPageSavedJobs] = useState(1);
    const [paginationSavedJobs, setPaginationSavedJobs] = useState({ total: 0, totalPages: 1 });

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openEditProfile, setOpenEditProfile] = useState(false);

    // ---------------- ACTIONS ----------------

    const handleLogout = async () => {
        const { success } = await logoutUser();
        if (success) {
            setUser(null);
            navigate("/home");
        }
    };

    const handleShowJobDetails = async (id) => {
        const { success, job } = await readOneJob(id);
        if (success) {
            setJobDetails(job);
            setShowJobDetails(true);
        }
    };

    const handleSaveJob = async (jobId) => {
        const { success } = await saveJob(jobId);
        if (success) loadSavedJobs();
    };

    const handleChangePassword = async () => {
        const { success, message } = await sendOtp();
        if (success) setOpenVerifyEmail(true);
        else toast.error(message);
    };

    // ---------------- LOADERS ----------------

    const loadSavedJobs = async () => {
        const { success, savedJobs, pagination } =
            await fetchAllSavedJobs({ page: pageSavedJobs });

        if (success) {
            setSavedJobs(savedJobs);
            setPaginationSavedJobs(pagination);
        }
    };

    const loadSavedJobList = async () => {
        const { success, savedJobsList } = await fetchAllSavedJobList();
        if (success) setSavedJobsList(savedJobsList);
    };

    const handleViewApplicantDetails = (applicationId) => {
        setApplicationId(applicationId);
        setViewApplicationDetail(true);
    }

    const handleShowEditApplication = (applicationId) => {
        setApplicationId(applicationId);
        setShowEditApplication(true);
    }


    useEffect(() => {
        const loadRecent = async () => {
            const { success, recentAppilcations, pagination } =
                await fetchRecentApplications({ page: pageRecentApplications });

            if (success) {
                setRecentApplications(recentAppilcations);
                setPaginationRecentApplications(pagination);
            }
        };
        loadRecent();
    }, [pageRecentApplications]);

    useEffect(() => {
        loadSavedJobs();
    }, [pageSavedJobs]);

    useEffect(() => {
        loadSavedJobList();
    }, []);

    // ---------------- UI ----------------

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Topbar />

            <div className="grid lg:grid-cols-[320px_1fr] gap-6 px-4 md:px-[10vw] py-8">

                {/* SIDEBAR */}
                <div className="space-y-4">

                    <div className="bg-white border border-gray-300 rounded-xl p-4 text-center space-y-3">
                        <div className="mx-auto bg-emerald-500 text-white h-16 w-16 flex items-center justify-center rounded-full">
                            <User size={28} />
                        </div>

                        <div>
                            <p className="font-semibold">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>

                        {/* LINKS */}
                        <div className="flex flex-col items-center gap-2 text-sm">
                            {user?.linkedIn && (
                                <a href={user.linkedIn} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-emerald-500 hover:underline">
                                    <Linkedin size={16} />
                                    LinkedIn
                                </a>
                            )}

                            {user?.portfolio && (
                                <a href={user.portfolio} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-emerald-500 hover:underline">
                                    <Globe size={16} />
                                    Portfolio
                                </a>
                            )}

                            {user?.phone && (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Phone size={16} />
                                    {user.phone}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setOpenEditProfile(true)}
                            className="btn w-full mt-2 gap-2 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            <Pencil size={16} />
                            Edit Profile
                        </button>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-2">
                        <button
                            className="btn w-full gap-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                            onClick={handleChangePassword}
                        >
                            <KeyRound size={16} />
                            Change Password
                        </button>

                        <button
                            className="btn w-full gap-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors rounded-lg"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Sign out
                        </button>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div>

                    {/* TABS */}
                    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">

                        <div className="flex border-b border-gray-300">

                            <button
                                onClick={() => setActiveTab("applications")}
                                className={`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium
                                ${activeTab === "applications"
                                        ? "border-b-2 border-emerald-500 text-emerald-500 bg-emerald-50"
                                        : "text-gray-500"}
                                `}
                            >
                                <FileText size={16} />
                                Applications
                                <span className="text-xs bg-gray-200 px-2 rounded-full">
                                    {paginationRecentApplications.total}
                                </span>
                            </button>

                            <button
                                onClick={() => setActiveTab("saved")}
                                className={`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium
                                ${activeTab === "saved"
                                        ? "border-b-2 border-emerald-500 text-emerald-500 bg-emerald-50"
                                        : "text-gray-500"}
                                `}
                            >
                                <Bookmark size={16} />
                                Saved Jobs
                                <span className="text-xs bg-gray-200 px-2 rounded-full">
                                    {paginationSavedJobs.total}
                                </span>
                            </button>

                        </div>

                        {/* TAB CONTENT */}
                        <div className="p-4">

                            {activeTab === "applications" && (
                                <>
                                    {recentApplications.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentApplications.map(app => (
                                                <ApplicationCard
                                                    key={app.id}
                                                    application={app}
                                                    handleShowEditApplication={(applicationId) => handleShowEditApplication(applicationId)}
                                                    handleViewApplicantDetails={(applicationId) => handleViewApplicantDetails(applicationId)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-400 py-10">
                                            No applications yet 🚀
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <Pagination
                                            pagination={paginationRecentApplications}
                                            page={pageRecentApplications}
                                            setPage={setPageRecentApplications}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === "saved" && (
                                <>
                                    {savedJobs.length > 0 ? (
                                        <div className="space-y-4">
                                            {savedJobs.map(job => (
                                                <Card
                                                    key={job.id}
                                                    job={job}
                                                    showDetails={handleShowJobDetails}
                                                    handleSaveJob={handleSaveJob}
                                                    savedJobsList={savedJobsList}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-400 py-10">
                                            No saved jobs ⭐
                                        </p>
                                    )}

                                    <div className="mt-4">
                                        <Pagination
                                            pagination={paginationSavedJobs}
                                            page={pageSavedJobs}
                                            setPage={setPageSavedJobs}
                                        />
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
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
                <ChangePassword onClose={() => setOpenChangePassword(false)} />
            )}

            {showJobDetails && (
                <ViewJobModal
                    job={jobDetails}
                    handleSaveJob={handleSaveJob}
                    savedJobsList={savedJobsList}
                    onClose={() => setShowJobDetails(false)}
                />
            )}

            {openEditProfile && (
                <EditProfile
                    onClose={() => setOpenEditProfile(false)}
                />
            )}
        </div>
    );
}