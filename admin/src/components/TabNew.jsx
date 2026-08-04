import { useState } from "react";
import NoData from "./ui/NoData";
import Pagination from "./Pagination";
import {
    ArrowRight,
    Ban,
    CircleX,
    EllipsisVertical,
    Eye,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    Modal,
    ModalBackground,
    ModalHeader,
} from "./ui/ui-modal";
import ForInterview from "./ForInterview";
import { formatShortDateTime } from "../utils/format";

export default function TabNew({
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
    const [showForInterview, setShowForInterview] = useState(false);

    const handleForInterview = (applicantId) => {
        setApplicantId(applicantId);
        setShowForInterview(true);
    };



    return (
        <>
            {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                    Loading applicants...
                </div>
            ) : data.length > 0 ? (
                <div className="table-style rounded-b-lg">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Position</th>
                                <th>Company</th>
                                <th>Applied Date</th>
                                <th className="action-cell">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((applicant) => (
                                <tr key={applicant.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="relative profile-logo h-10 w-10">
                                                {applicant.firstName[0]}
                                                {applicant.lastName[0]}

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
                                                    {applicant.firstName}{" "}
                                                    {applicant.lastName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {applicant.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td>{applicant.job?.jobTitle}</td>

                                    <td>
                                        {applicant.job?.company?.companyName}
                                    </td>

                                    <td>
                                        {formatShortDateTime(applicant?.createdAt)}
                                    </td>

                                    <td>
                                        <div className="flex justify-center">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger className="btn btn-square btn-ghost rounded-lg hover:bg-gray-200">
                                                    <EllipsisVertical size={16} />
                                                </DropdownMenu.Trigger>

                                                <DropdownMenu.Content
                                                    align="end"
                                                    className="minimenu"
                                                >
                                                    <DropdownMenu.Item
                                                        onClick={() => handleForInterview(applicant.id)}
                                                    >
                                                        <ArrowRight size={16} />
                                                        For Interview
                                                    </DropdownMenu.Item>

                                                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleApplicantDetails(
                                                                applicant.id
                                                            )
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </DropdownMenu.Item>

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleRejectApplicant(
                                                                applicant.id
                                                            )
                                                        }
                                                    >
                                                        <CircleX size={16} />
                                                        Reject
                                                    </DropdownMenu.Item>

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleBlacklist(
                                                                applicant.id
                                                            )
                                                        }
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


            {showForInterview && (
                <ForInterview
                    applicantId={applicantId}
                    onClose={() => setShowForInterview(false)}
                    loadAfter={loadAfter}
                />
            )}
        </>
    );
}