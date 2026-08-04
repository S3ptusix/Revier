import { useState } from "react";
import NoData from "./ui/NoData";
import Pagination from "./Pagination";
import { Ban, Calendar, Check, CircleX, EllipsisVertical, Eye } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AddToEvent from "./AddToEvent";
import ChangeEvent from "./ChangeEvent";
import { editOrientationStatus } from "../services/orientationsServices";
import { toast } from "react-toastify";

// ✅ IMPORT YOUR MODAL
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "../components/ui/ui-modal";
import { formatShortDateTime } from "../utils/format";

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
    handleBlacklist = () => { },
    loadAfter = () => { },
}) {
    const [applicantId, setApplicantId] = useState(null);
    const [openAddToEvent, setOpenAddToEvent] = useState(false);
    const [openChangeEvent, setOpenChangeEvent] = useState(false);

    // ✅ CONFIRM MODAL STATE
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleAddToEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenAddToEvent(true);
    };

    const handleChangeEvent = (applicantId) => {
        setApplicantId(applicantId);
        setOpenChangeEvent(true);
    };

    // ✅ OPEN MODAL INSTEAD OF TOAST
    const handleConfirmOrientationStatus = (applicantId, status) => {
        setSelectedApplicantId(applicantId);
        setSelectedStatus(status);
        setOpenConfirmModal(true);
    };

    // ✅ SUBMIT ACTION
    const handleSubmitOrientationStatus = async () => {
        try {
            const { success, message } = await editOrientationStatus(
                selectedApplicantId,
                { orientationStatus: selectedStatus }
            );

            if (success) {
                loadAfter();
                toast.success(message);
            } else {
                console.error(message);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpenConfirmModal(false);
            setSelectedApplicantId(null);
            setSelectedStatus(null);
        }
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
                                <th>Event Details</th>
                                <th className="action-cell">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((applicant) => {

                                const isUpcoming =
                                    applicant?.orientationEvent?.eventAt &&
                                    new Date(applicant.orientationEvent.eventAt) > new Date();

                                return (
                                    <tr key={applicant?.id}>
                                        <td>
                                            <div className="flex items-center gap-2">
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

                                        <td>{applicant?.job?.jobTitle}</td>
                                        <td>{applicant?.job?.company?.companyName}</td>
                                        <td>
                                            {applicant?.orientationEvent ? (
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">
                                                            {applicant.orientationEvent.eventTitle || "Untitled Event"}
                                                        </span>
                                                        {applicant.orientationEvent.eventMode && (
                                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                                {applicant.orientationEvent.eventMode}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        {applicant.orientationEvent.location && (
                                                            <span>{applicant.orientationEvent.location}</span>
                                                        )}
                                                        {applicant.orientationEvent.location && applicant.orientationEvent.eventAt && (
                                                            <span className="text-gray-300">•</span>
                                                        )}
                                                        {applicant.orientationEvent.eventAt && (
                                                            <span>{formatShortDateTime(applicant.orientationEvent.eventAt)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>

                                        <td>
                                            <div className="flex justify-center">
                                                <DropdownMenu.Root>
                                                    <DropdownMenu.Trigger className="btn btn-square btn-ghost hover:bg-gray-200 rounded-lg">
                                                        <EllipsisVertical size={16} />
                                                    </DropdownMenu.Trigger>

                                                    <DropdownMenu.Content align="end" className="minimenu">
                                                        <DropdownMenu.Item
                                                            onClick={() =>
                                                                applicant?.orientationId
                                                                    ? handleChangeEvent(applicant?.id)
                                                                    : handleAddToEvent(applicant?.id)
                                                            }
                                                        >
                                                            <Calendar size={16} />
                                                            {applicant?.orientationId ? "Change event" : "Add to event"}
                                                        </DropdownMenu.Item>
                                                        {applicant?.orientationId && (
                                                            <>
                                                                <DropdownMenu.Item
                                                                    disabled={isUpcoming}
                                                                    className={`text-emerald-500 ${isUpcoming ? 'opacity-50 pointer-events-none' : ''
                                                                        }`}
                                                                    onClick={() =>
                                                                        handleConfirmOrientationStatus(applicant?.id, "Present")
                                                                    }
                                                                >
                                                                    <Check size={16} />
                                                                    Present in event
                                                                </DropdownMenu.Item>

                                                                <DropdownMenu.Item
                                                                    disabled={isUpcoming}
                                                                    className={`text-red-500 ${isUpcoming ? 'opacity-50 pointer-events-none' : ''
                                                                        }`}
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

                                                        <DropdownMenu.Item onClick={() => handleApplicantDetails(applicant?.id)}>
                                                            <Eye size={16} />
                                                            View Details
                                                        </DropdownMenu.Item>

                                                        <DropdownMenu.Item onClick={() => handleBlacklist(applicant?.id)}>
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
                <Pagination pagination={pagination} page={page} setPage={setPage} />
            </div>

            {/* ✅ CONFIRM MODAL */}
            {openConfirmModal && (
                <ModalBackground>
                    <Modal maxWidth={400}>
                        <ModalHeader
                            icon={selectedStatus === "Present" ? Check : CircleX}
                            title={
                                selectedStatus === "Present"
                                    ? "Confirm Attendance"
                                    : "Confirm Absence"
                            }
                            subTitle={
                                selectedStatus === "Present"
                                    ? "This applicant will be marked as HIRED."
                                    : "This applicant will be REJECTED."
                            }
                            onClose={() => setOpenConfirmModal(false)}
                        />

                        <div className="mt-4 text-sm text-gray-600">
                            Are you sure you want to mark this applicant as{" "}
                            <span className="font-semibold">
                                {selectedStatus}
                            </span>
                            ?
                        </div>

                        <div className="mt-6">
                            <ModalFooter
                                cancelLabel="Cancel"
                                submitLabel="Confirm"
                                onClose={() => setOpenConfirmModal(false)}
                                onSubmit={handleSubmitOrientationStatus}
                                submitColor={selectedStatus === "Absent" ? "RED" : "GREEN"}
                            />
                        </div>
                    </Modal>
                </ModalBackground>
            )}

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