import Sidemenu from "./Sidemenu";
import Topbar from "./Topbar";
import { Ban, Calendar, Check, CircleCheckBig, CircleX, EllipsisVertical, Eye, MapPin, Search, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import ScheduleInteview from "./ScheduleInterview";
import { cleanDateTime } from "../utils/format";
import RescheduleInteview from "./RescheduleInterview";
import Select from "./ui/Select";
import Pagination from "./Pagination";
import Input from "./ui/Input";
import NoData from "./ui/NoData";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { interviewResult } from "../services/applicants";

export default function TabInterview({
    isLoading = false,
    data = [],
    pagination = {
        total: 0,
        totalPages: 1,
    },
    page = 1,
    setPage = () => { },
    handleApplicantDetails = () => { },
    handleRejectApplicant = () => { },
    handleBlacklist = () => { },
    loadAfter = () => { },
}) {
    const [applicantId, setApplicantId] = useState(null);

    const [showScheduleInterview, setShowScheduleInterview] = useState(false);
    const [showRescheduleInterview, setShowRescheduleInterview] = useState(false);
    const [showInterviewResult, setShowInterviewResult] = useState(false);

    const handleScheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowScheduleInterview(true);
    };

    const handleRescheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowRescheduleInterview(true);
    };

    const handleInterviewResult = async (applicantId, interviewStatus) => {
        try {
            const { success, message } = await interviewResult(applicantId, { interviewStatus });
            if (success) {
                loadAfter();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    // ✅ NEW: Confirmation handler
    const handleConfirmInterviewResult = (applicantId, status) => {
        toast.info(
            <div>
                <p className="mb-2 font-medium">
                    {status === "Passed"
                        ? "Mark this applicant as PASSED?"
                        : "Mark this applicant as FAILED?"}
                </p>
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                            handleInterviewResult(applicantId, status);
                            toast.dismiss();
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            { autoClose: false }
        );
    };

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div>
                        {data.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Applicant</th>
                                            <th>Position</th>
                                            <th>Company</th>
                                            <th>Interview Details</th>
                                            <th className="action-cell">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(applicant => (
                                            <tr key={applicant?.id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative profile-logo h-10 w-10">
                                                            {applicant?.firstName[0]}{applicant?.lastName[0]}
                                                            {applicant?.user?.applicants?.length > 0 && (
                                                                <div className="absolute -top-1 -right-1 tooltip bg-red-500 text-white p-0.5 rounded-full" data-tip="Blacklisted">
                                                                    <Ban size={16} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold">
                                                                {applicant?.firstName} {applicant?.lastName}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {applicant?.user?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    <p>{applicant?.job?.jobTitle}</p>
                                                </td>

                                                <td>
                                                    <p>{applicant?.job?.company?.companyName}</p>
                                                </td>

                                                <td>
                                                    {applicant?.interviewAt ? (
                                                        <>
                                                            <p className="flex gap-2 items-center">
                                                                <Calendar size={12} />
                                                                {cleanDateTime(applicant?.interviewAt)}
                                                            </p>
                                                            {applicant?.interviewLocation && (
                                                                <p className="flex gap-2 items-center">
                                                                    <MapPin size={12} />
                                                                    {applicant?.interviewLocation}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-500">Not scheduled</p>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="flex justify-center">
                                                        <DropdownMenu.Root>
                                                            <DropdownMenu.Trigger className="btn btn-square btn-ghost border-none hover:bg-gray-200 rounded-lg outline-0">
                                                                <EllipsisVertical size={16} />
                                                            </DropdownMenu.Trigger>

                                                            <DropdownMenu.Content align="end" className="minimenu">
                                                                {applicant?.interviewAt ? (
                                                                    <DropdownMenu.Item
                                                                        onClick={() => handleRescheduleInterview(applicant?.id)}
                                                                    >
                                                                        <Calendar size={16} />
                                                                        Reschedule Interview
                                                                    </DropdownMenu.Item>
                                                                ) : (
                                                                    <DropdownMenu.Item
                                                                        onClick={() => handleScheduleInterview(applicant?.id)}
                                                                    >
                                                                        <Calendar size={16} />
                                                                        Schedule Interview
                                                                    </DropdownMenu.Item>
                                                                )}

                                                                {applicant?.interviewAt !== null && (
                                                                    <>
                                                                        <DropdownMenu.Item
                                                                            className="text-emerald-500"
                                                                            onClick={() =>
                                                                                handleConfirmInterviewResult(applicant?.id, "Passed")
                                                                            }
                                                                        >
                                                                            <Check size={16} />
                                                                            Passed Interview
                                                                        </DropdownMenu.Item>

                                                                        <DropdownMenu.Item
                                                                            className="text-red-500"
                                                                            onClick={() =>
                                                                                handleConfirmInterviewResult(applicant?.id, "Failed")
                                                                            }
                                                                        >
                                                                            <CircleX size={16} />
                                                                            Failed Interview
                                                                        </DropdownMenu.Item>
                                                                    </>
                                                                )}

                                                                <DropdownMenu.Separator className="DropdownMenuSeparator" />

                                                                <DropdownMenu.Item
                                                                    onClick={() => handleApplicantDetails(applicant?.id)}
                                                                >
                                                                    <Eye size={16} />
                                                                    View Details
                                                                </DropdownMenu.Item>

                                                                <DropdownMenu.Item
                                                                    onClick={() => handleRejectApplicant(applicant?.id)}
                                                                >
                                                                    <CircleX size={16} />
                                                                    Rejected
                                                                </DropdownMenu.Item>

                                                                <DropdownMenu.Item
                                                                    onClick={() => handleBlacklist(applicant?.id)}
                                                                >
                                                                    <Ban size={16} />
                                                                    Blacklist
                                                                </DropdownMenu.Item>
                                                            </DropdownMenu.Content>
                                                        </DropdownMenu.Root>
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
                        )}

                        <div className="mt-4">
                            <Pagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
                        </div>
                    </div>
                </>
            )}

            {showScheduleInterview && (
                <ScheduleInteview
                    applicantId={applicantId}
                    onClose={() => setShowScheduleInterview(false)}
                    loadAfter={loadAfter}
                />
            )}

            {showRescheduleInterview && (
                <RescheduleInteview
                    applicantId={applicantId}
                    onClose={() => setShowRescheduleInterview(false)}
                    loadAfter={loadAfter}
                />
            )}

            {showInterviewResult && (
                <InterviewResult
                    applicantId={applicantId}
                    onClose={() => setShowInterviewResult(false)}
                    loadAfter={loadAfter}
                />
            )}
        </div>
    );

}
