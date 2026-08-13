import Sidemenu from "./SideMenu";
import { Ban, Calendar, Check, CircleCheckBig, CircleX, EllipsisVertical, Eye, Loader, MapPin, Search, User } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { formatShortDateTime } from "../utils/format";
import RescheduleInterview from "./RescheduleInterview";
import Select from "./ui/Select";
import Pagination from "./Pagination";
import Input from "./ui/Input";
import NoData from "./ui/NoData";
import ForOrientation from "./ForOrientation";
import { Modal, ModalBackground, ModalFooter } from "./ui/ui-modal";
import FailedInterview from "./FailedInterview";
import { useEffect } from "react";
import BulkForOrientation from "./BulkForOrientation";
import BulkFailedInterview from "./BulkFailedInterview";

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

    const [selectedApplicants, setSelectedApplicants] = useState([]);

    const [showBulkForOrientation, setShowBulkForOrientation] = useState(false);
    const [showBulkFailedInterview, setShowBulkFailedInterview] = useState(false);

    const [allSelectedInterviewDone, setAllSelectedInterviewDone] = useState(false);

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

    const allSelected =
        data.length > 0 &&
        data.every((applicant) =>
            selectedApplicants.includes(applicant.id)
        );

    const handleSelectAll = (e) => {
        const checked = e.target.checked;

        if (checked) {
            // Select all applicants on the current page
            setSelectedApplicants(data.map((applicant) => applicant.id));
        } else {
            // Unselect all applicants on the current page
            setSelectedApplicants((prev) =>
                prev.filter(
                    (id) => !data.some((applicant) => applicant.id === id)
                )
            );
        }
    };

    const handleSelectApplicant = (id, checked) => {
        setSelectedApplicants((prev) => {
            if (checked) {
                return [...prev, id];
            }

            return prev.filter((selectedId) => selectedId !== id);
        });
    };

    useEffect(() => {
        setSelectedApplicants([]);
    }, [page]);

    useEffect(() => {
        setAllSelectedInterviewDone(
            selectedApplicants.length > 0 &&
            data
                .filter(applicant => selectedApplicants.includes(applicant?.id))
                .every(applicant => new Date(applicant?.interviewAt) < new Date())
        );

    }, [selectedApplicants, data]);

    return (
        <>
            {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                    Loading applicants...
                </div>
            ) : (
                <>
                    <div>
                        {data.length > 0 ? (
                            <div className="table-style rounded-b-lg">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={allSelected}
                                                        onChange={handleSelectAll}
                                                    />
                                                    <p>Applicant</p>
                                                </div>
                                            </th>
                                            <th>Position</th>
                                            <th>Company</th>
                                            <th>Interview Schedule</th>
                                            <th>Interview Location</th>
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
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedApplicants.includes(applicant.id)}
                                                                onChange={(e) =>
                                                                    handleSelectApplicant(
                                                                        applicant.id,
                                                                        e.target.checked
                                                                    )
                                                                }
                                                            />
                                                            <div className="relative profile-logo h-10 w-10">
                                                                {applicant?.firstName[0]}
                                                                {applicant?.lastName[0]}

                                                                {applicant?.user?.applicants
                                                                    ?.length > 0 && (
                                                                        <div
                                                                            className="absolute -top-1 -right-1 tooltip rounded-full bg-black p-0.5 text-white"
                                                                            data-tip="Blacklisted"
                                                                        >
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
                                                        {formatShortDateTime(applicant.interviewAt)}
                                                    </td>

                                                    <td>
                                                        {applicant.interviewMode === 'Virtual (Video Call)' ?
                                                            <a
                                                                href={applicant.interviewLocation}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="underline text-blue-600"
                                                            >Interview Link</a> :
                                                            applicant.interviewLocation
                                                        }
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

            {showConfirmFail && (
                <FailedInterview
                    applicantId={applicantId}
                    onClose={() => setShowConfirmFail(false)}
                    loadAfter={loadAfter}
                />
            )}

            {showBulkForOrientation && (
                <BulkForOrientation
                    applicantIds={selectedApplicants}
                    onClose={() => setShowBulkForOrientation(false)}
                    loadAfter={() => {
                        loadAfter();
                        setSelectedApplicants([]);
                    }}
                />
            )}

            {showBulkFailedInterview && (
                <BulkFailedInterview
                    applicantIds={selectedApplicants}
                    onClose={() => setShowBulkFailedInterview(false)}
                    loadAfter={() => {
                        loadAfter();
                        setSelectedApplicants([]);
                    }}
                />
            )}

            {selectedApplicants.length > 0 && (
                <div className="sticky left-8 bottom-6 bg-black p-4 rounded-lg shadow mt-4">
                    <p className="text-sm text-white mb-4">
                        {selectedApplicants.length} {selectedApplicants.length === 1 ? "applicant" : "applicants"} selected
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button
                            className="btn rounded-lg"
                            disabled={!allSelectedInterviewDone}
                            onClick={() => setShowBulkForOrientation(true)}
                        >
                            Mark as Passed
                        </button>

                        <button
                            className="btn rounded-lg"
                            disabled={!allSelectedInterviewDone}
                            onClick={() => setShowBulkFailedInterview(true)}
                        >
                            Mark as Failed
                        </button>
                    </div>
                </div>
            )}
        </>
    );

}
