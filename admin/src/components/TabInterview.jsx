import Sidemenu from "./Sidemenu";
import { Ban, Calendar, Check, CircleCheckBig, CircleX, EllipsisVertical, Eye, MapPin, Search, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { formatShortDateTime } from "../utils/format";
import RescheduleInterview from "./RescheduleInterview";
import Select from "./ui/Select";
import Pagination from "./Pagination";
import Input from "./ui/Input";
import NoData from "./ui/NoData";
import Loading from "./Loading";
import ForOrientation from "./ForOrientation";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";
import FailedInterview from "./FailedInterview";

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
    handleBlacklist = () => { },
    loadAfter = () => { },
}) {
    const [applicantId, setApplicantId] = useState(null);
    const [showRescheduleInterview, setShowRescheduleInterview] = useState(false);
    const [showForOrientation, setShowForOrientation] = useState(false);
    const [showConfirmFail, setShowConfirmFail] = useState(false);

    const handleRescheduleInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowRescheduleInterview(true);
    };

    const handlePassedInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowForOrientation(true);
    }

    const handleFailedInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowConfirmFail(true);
    };

    return (
        <div>
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <div>
                        {data.length > 0 ? (
                            <div className="table-style rounded-b-lg">
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
                                        {data.map(applicant => {

                                            const isUpcoming =
                                                applicant?.interviewAt &&
                                                new Date(applicant.interviewAt) > new Date();

                                            return (
                                                <tr key={applicant?.id}>
                                                    <td>
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative profile-logo h-10 w-10">
                                                                {applicant?.firstName[0]}{applicant?.lastName[0]}
                                                                {applicant?.user?.applicants?.length > 0 && (
                                                                    <div className="absolute -top-1 -right-1 tooltip rounded-full bg-black p-0.5 text-white" data-tip="Blacklisted">
                                                                        <Ban size={12} />
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
                                                            <div className="flex flex-col gap-1 text-xs">

                                                                <p className="flex items-center gap-2 text-gray-700">
                                                                    <Calendar size={14} className="text-gray-400" />
                                                                    <span className="font-medium">
                                                                        {formatShortDateTime(applicant.interviewAt)}
                                                                    </span>
                                                                </p>

                                                                {applicant?.interviewLocation && (
                                                                    <p className="flex items-center gap-2 text-gray-500">
                                                                        <MapPin size={14} className="text-gray-400" />
                                                                        <span className="truncate max-w-50">
                                                                            {applicant.interviewLocation}
                                                                        </span>
                                                                    </p>
                                                                )}

                                                            </div>
                                                        ) : (
                                                            <p className="text-xs text-gray-400 italic">
                                                                No interview scheduled
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <div className="flex justify-center">
                                                            <DropdownMenu.Root>
                                                                <DropdownMenu.Trigger className="btn btn-square btn-ghost border-none hover:bg-gray-200 rounded-lg outline-0">
                                                                    <EllipsisVertical size={16} />
                                                                </DropdownMenu.Trigger>

                                                                <DropdownMenu.Content align="end" className="minimenu">

                                                                    <DropdownMenu.Item
                                                                        onClick={() => handleRescheduleInterview(applicant?.id)}
                                                                    >
                                                                        <Calendar size={16} />
                                                                        Reschedule Interview
                                                                    </DropdownMenu.Item>

                                                                    {applicant?.interviewAt !== null && (
                                                                        <>
                                                                            <DropdownMenu.Item
                                                                                className={`text-emerald-500 ${isUpcoming ? 'opacity-50 pointer-events-none' : ''}`}
                                                                                onClick={() =>
                                                                                    handlePassedInterview(applicant?.id)
                                                                                }
                                                                            >
                                                                                <Check size={16} />
                                                                                Passed Interview
                                                                            </DropdownMenu.Item>

                                                                            <DropdownMenu.Item
                                                                                className={`text-red-500 ${isUpcoming ? 'opacity-50 pointer-events-none' : ''}`}
                                                                                onClick={() =>
                                                                                    handleFailedInterview(applicant?.id)
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
                                            )
                                        }

                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-b-lg overflow-hidden">
                                <NoData />
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

            {showRescheduleInterview && (
                <RescheduleInterview
                    applicantId={applicantId}
                    onClose={() => setShowRescheduleInterview(false)}
                    loadAfter={loadAfter}
                />
            )}

            {showForOrientation && (
                <ForOrientation
                    applicantId={applicantId}
                    onClose={() => setShowForOrientation(false)}
                    loadAfter={loadAfter}
                />
            )}

            {showConfirmFail && (
                <FailedInterview
                    applicantId={applicantId}
                    onClose={() => setShowConfirmFail(false)}
                    loadAfter={loadAfter}
                />
            )}
        </div>
    );

}
