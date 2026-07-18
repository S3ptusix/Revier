import { useState } from "react";
import NoData from "./ui/NoData";
import Pagination from "./Pagination";
import { Ban, Calendar, Check, CircleX, EllipsisVertical, Eye } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AddToEvent from "./AddToEvent";
import ChangeEvent from "./ChangeEvent";
import { editOrientationStatus } from "../services/orientationsServices";
import { toast } from "react-toastify";

export default function TabOrientation({
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
    const [openAddToEvent, setOpenAddToEvent] = useState(false);
    const [openChangeEvent, setOpenChangeEvent] = useState(false);


    const handleAddToEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenAddToEvent(true);
    };

    const handleChangeEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenChangeEvent(true);
    };

    const handleUpdateOrientationStatus = async (applicantId, orientationStatus) => {
        try {
            const { success, message } = await editOrientationStatus(applicantId, { orientationStatus });

            if (success) {
                loadAfter();
                return toast.success(message, { toastId: "success-submit" });
            }

            console.error(message);
        } catch (error) {
            console.error("Error on handleUpdateOrientationStatus:", error);
        }
    };

    // ✅ NEW: Confirmation handler
    const handleConfirmOrientationStatus = (applicantId, status) => {
        toast.info(
            <div>
                <p className="mb-2 font-medium">
                    {status === "Present"
                        ? "Mark this applicant as PRESENT?"
                        : "Mark this applicant as ABSENT?"}
                </p>
                <div className="flex gap-2">
                    <button
                        className="btn btn-sm btn-success"
                        onClick={() => {
                            handleUpdateOrientationStatus(applicantId, status);
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
                                <th>Event</th>
                                <th className="action-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((applicant) => (
                                <tr key={applicant?.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="relative profile-logo h-10 w-10">
                                                {applicant?.firstName[0]}
                                                {applicant?.lastName[0]}
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
                                        {applicant?.orientationEvent?.eventTitle || "-"}
                                    </td>

                                    <td>
                                        <div className="flex justify-center">
                                            <DropdownMenu.Root>
                                                <DropdownMenu.Trigger className="btn btn-square btn-ghost hover:bg-gray-200 rounded-lg">
                                                    <EllipsisVertical size={16} />
                                                </DropdownMenu.Trigger>

                                                <DropdownMenu.Content align="end" className="minimenu">
                                                    <DropdownMenu.Item
                                                        onClick={() => {
                                                            applicant?.orientationId
                                                                ? handleChangeEvent(applicant?.id)
                                                                : handleAddToEvent(applicant?.id);
                                                        }}
                                                    >
                                                        <Calendar size={16} />
                                                        {applicant?.orientationId
                                                            ? "Change event"
                                                            : "Add to event"}
                                                    </DropdownMenu.Item>

                                                    {applicant?.orientationId && (
                                                        <>
                                                            <DropdownMenu.Item
                                                                className="text-emerald-500"
                                                                onClick={() =>
                                                                    handleConfirmOrientationStatus(applicant?.id, "Present")
                                                                }
                                                            >
                                                                <Check size={16} />
                                                                Present in event
                                                            </DropdownMenu.Item>

                                                            <DropdownMenu.Item
                                                                className="text-red-500"
                                                                onClick={() =>
                                                                    handleConfirmOrientationStatus(applicant?.id, "Absent")
                                                                }
                                                            >
                                                                <CircleX size={16} />
                                                                Absent in event
                                                            </DropdownMenu.Item>
                                                        </>
                                                    )}

                                                    <DropdownMenu.Separator className="DropdownMenuSeparator" />

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleApplicantDetails(applicant?.id)
                                                        }
                                                    >
                                                        <Eye size={16} />
                                                        View Details
                                                    </DropdownMenu.Item>

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleRejectApplicant(applicant?.id)
                                                        }
                                                    >
                                                        <CircleX size={16} />
                                                        Reject
                                                    </DropdownMenu.Item>

                                                    <DropdownMenu.Item
                                                        onClick={() =>
                                                            handleBlacklist(applicant?.id)
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

            {openAddToEvent && (
                <AddToEvent
                    applicantId={applicantId}
                    onClose={() => setOpenAddToEvent(false)}
                    loadAfter={loadAfter}
                />
            )}

            {openChangeEvent && (
                <ChangeEvent
                    applicantId={applicantId}
                    onClose={() => setOpenChangeEvent(false)}
                    loadAfter={loadAfter}
                />
            )}
        </>
    );

}
