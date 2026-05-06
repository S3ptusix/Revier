import NoData from "./ui/NoData";
import Pagination from "./Pagination";
import { ArrowRight, Ban, CircleX, EllipsisVertical, Eye } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

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
    handleMoveApplicant = () => { },
}) {

    return (
        <>
            {isLoading ? (
                <div className="p-6 text-center text-gray-500">
                    Loading applicants...
                </div>
            ) : data.length > 0 ? (
                <div className="table-style">
                    <table>
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Position</th>
                                <th>Company</th>
                                <th className="action-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((applicant) => (
                                <tr key={applicant?.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="relative profile-logo h-10 w-10">
                                                {applicant?.firstName[0]}{applicant?.lastName[0]}
                                                {applicant?.user?.applicants?.length > 0 &&
                                                    <div className="absolute -top-1 -right-1 tooltip bg-red-500 text-white p-0.5 rounded-full" data-tip="Blacklisted">
                                                        <Ban size={16} />
                                                    </div>
                                                }

                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{applicant?.firstName} {applicant?.lastName}</p>
                                                <p className="text-sm text-gray-500">{applicant?.user?.email}</p>
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
                                        <div className="flex justify-center">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger className="btn btn-square btn-ghost hover:bg-gray-200 rounded-lg">
                                                    <EllipsisVertical size={16} />
                                                </DropdownMenu.Trigger>
                                                <DropdownMenu.Content align="end" className="minimenu">
                                                    <DropdownMenu.Item
                                                        onClick={() => handleMoveApplicant(applicant?.id)}
                                                    >
                                                        <ArrowRight size={16} />
                                                        Move to Interview
                                                    </DropdownMenu.Item>
                                                    <DropdownMenu.DropdownMenuSeparator className="DropdownMenuSeparator" />
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
                                                        Reject
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
                    <NoData message="No applicants found" />
                </div>
            )}

            <div className="mt-4">
                <Pagination
                    pagination={pagination}
                    page={page}
                    setPage={setPage}
                />
            </div>
        </>
    );
}