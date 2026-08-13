import { useState } from "react";
import NoData from "./ui/NoData";
import Pagination from "./Pagination";
import { Ban, Calendar, Check, CircleX, EllipsisVertical, Eye, Loader } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AddToEvent from "./AddToEvent";
import ChangeEvent from "./ChangeEvent";
import { bulkEditOrientationStatus, bulkRemoveFromEvent, editOrientationStatus, removeFromEvent } from "../services/orientationsServices";
import { toast } from "react-toastify";

// ✅ IMPORT YOUR MODAL
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "../components/ui/ui-modal";
import { formatShortDateTime } from "../utils/format";
import BulkMoveToEvent from "./BulkMoveToEvent";
import { useEffect } from "react";

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
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [applicantId, setApplicantId] = useState(null);
    const [openAddToEvent, setOpenAddToEvent] = useState(false);
    const [openChangeEvent, setOpenChangeEvent] = useState(false);

    // ✅ CONFIRM MODAL STATE
    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [openBulkMoveToEvent, setOpenBulkMoveToEvent] = useState(false);

    const [openBulkRemoveFromEvent, setOpenBulkRemoveFromEvent] = useState(false);
    const [openBulkEditOrientationStatus, setOpenBulkEditOrientationStatus] = useState(false);

    const [allSelectedEventDone, setAllSelectedEventDone] = useState(false);
    const [allSelectedHasEvent, setAllSelectedHasEvent] = useState(false);

    const [bulkLoading, setBulkLoading] = useState(false);

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
            setUpdatingStatus(true);
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
            setUpdatingStatus(false);
        }
    };

    const handleRemoveFromEvent = async (applicantId) => {
        try {
            const { success, message } = await removeFromEvent(applicantId);
            if (!success) return toast.error(message);
            loadAfter();
        } catch (error) {
            console.error(error);
        }
    };

    const handleBulkRemoveFromEvent = async () => {
        try {
            setBulkLoading(true);
            const { success, message } = await bulkRemoveFromEvent(selectedApplicants);
            if (!success) return toast.error(message);
            loadAfter();
        } catch (error) {
            console.error(error);
        } finally {
            setOpenBulkRemoveFromEvent(false);
            setBulkLoading(false);
            setSelectedApplicants([]);
        }
    };

    const handleBulkEditOrientationStatus = async () => {
        try {
            setBulkLoading(true);
            const { success, message } = await bulkEditOrientationStatus({
                applicantIds: selectedApplicants,
                orientationStatus: selectedStatus
            });

            if (!success) return toast.error(message);
            loadAfter();

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setOpenBulkEditOrientationStatus(false);
            setSelectedStatus(null);
            setBulkLoading(false);
            setSelectedApplicants([]);
        }
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
        setAllSelectedEventDone(
            selectedApplicants.length > 0 &&
            data
                .filter(applicant => selectedApplicants.includes(applicant?.id))
                .every(applicant => new Date(applicant?.orientationEvent?.eventAt) < new Date())
        );

        setAllSelectedHasEvent(
            selectedApplicants.length > 0 &&
            data
                .filter(applicant => selectedApplicants.includes(applicant?.id))
                .every(applicant => applicant?.orientationId)
        );

    }, [selectedApplicants, data]);

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
                                <th>Event Details</th>
                                <th>Event Location</th>
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

                                        <td>{applicant?.job?.jobTitle}</td>
                                        <td>{applicant?.job?.company?.companyName}</td>
                                        <td>
                                            {applicant?.orientationEvent ? (
                                                <div className="border border-gray-300 bg-gray-100 p-2 rounded w-fit">
                                                    <span className="font-medium text-gray-900">
                                                        {applicant?.orientationEvent?.eventTitle || "Untitled Event"}
                                                    </span>
                                                    {applicant?.orientationEvent?.eventAt && (
                                                        <p className="text-xs">{formatShortDateTime(applicant?.orientationEvent?.eventAt)}</p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>


                                        <td>
                                            {applicant?.orientationEvent?.eventMode === 'Virtual (Video Call)' ?
                                                <a
                                                    href={applicant?.orientationEvent?.location}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline text-blue-600"
                                                >Orientation Link</a> :
                                                applicant?.orientationEvent?.location
                                            }
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
                                                                <DropdownMenu.Item
                                                                    onClick={() =>
                                                                        handleRemoveFromEvent(applicant?.id)
                                                                    }
                                                                >
                                                                    <CircleX size={16} />
                                                                    Remove from Event
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

            {openConfirmModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
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
                        <ModalBody>
                            <div className="text-sm">
                                Are you sure you want to mark this applicant as{" "}
                                <span className="font-semibold">
                                    {selectedStatus}
                                </span>
                                ?
                            </div>
                        </ModalBody>

                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={updatingStatus ? 'Updating Status...' : `Mark as ${selectedStatus}`}
                            onClose={() => setOpenConfirmModal(false)}
                            onSubmit={handleSubmitOrientationStatus}
                            submitColor={selectedStatus === "Absent" ? "RED" : "GREEN"}
                            disableSubmit={updatingStatus}
                        />
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

            {openBulkMoveToEvent && (
                <BulkMoveToEvent
                    applicantIds={selectedApplicants}
                    onClose={() => setOpenBulkMoveToEvent(false)}
                    loadAfter={() => {
                        loadAfter();
                        setSelectedApplicants([]);
                    }}
                />
            )}

            {openBulkRemoveFromEvent && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title={`Remove ${selectedApplicants.length} ${selectedApplicants.length > 1 ? 'Applicants' : 'Applicant'} from event`}
                            onClose={() => setOpenBulkRemoveFromEvent(false)}
                        />
                        <ModalBody>
                            <p className="text-sm">
                                This action will remove the selected{' '}
                                {selectedApplicants.length > 1 ? 'applicants' : 'applicant'} from
                                the event.
                            </p>
                        </ModalBody>
                        <ModalFooter
                            onSubmit={handleBulkRemoveFromEvent}
                            submitLabel={bulkLoading ? 'Removing' : 'Remove from Event'}
                            disableSubmit={bulkLoading}
                            disableSubmit={bulkLoading}
                            onClose={() => setOpenBulkRemoveFromEvent(false)}
                        />
                    </Modal>
                </ModalBackground>
            )}

            {openBulkEditOrientationStatus && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title={
                                selectedStatus === "Present"
                                    ? "Confirm Attendance"
                                    : "Confirm Absence"
                            }
                            subTitle={
                                selectedStatus === "Present"
                                    ? `${selectedApplicants.length} ${selectedApplicants.length > 1
                                        ? "Applicants"
                                        : "Applicant"
                                    } will be marked as HIRED.`
                                    : `${selectedApplicants.length} ${selectedApplicants.length > 1
                                        ? "Applicants"
                                        : "Applicant"
                                    } will be marked as REJECTED.`
                            }
                            onClose={() => setOpenBulkEditOrientationStatus(false)}
                        />

                        <ModalBody>
                            <p className="text-sm">
                                Are you sure you want to mark the selected {selectedApplicants.length > 1 ? "applicants" : "applicant"} as {selectedStatus} ?
                            </p>
                        </ModalBody>

                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={
                                updatingStatus
                                    ? "Updating Status..."
                                    : `Mark as ${selectedStatus}`
                            }
                            onClose={() => setOpenBulkEditOrientationStatus(false)}
                            onSubmit={handleBulkEditOrientationStatus}
                            submitColor={selectedStatus === "Absent" ? "RED" : "GREEN"}
                            disableSubmit={updatingStatus}
                        />
                    </Modal>
                </ModalBackground>
            )}

            {bulkLoading && (
                <ModalBackground>
                    <Loader className='animate-spin text-emerald-500' />
                </ModalBackground>
            )}

            {selectedApplicants.length > 0 && (
                <div className="sticky left-8 bottom-6 bg-black p-4 rounded-lg shadow mt-4">
                    <p className="text-sm text-white mb-4">
                        {selectedApplicants.length} {selectedApplicants.length === 1 ? "applicant" : "applicants"} selected
                    </p>
                    <div className="grid sm:grid-cols-4 gap-4">
                        <button
                            className="btn rounded-lg"
                            onClick={() => setOpenBulkMoveToEvent(true)}
                        >
                            Move to Event
                        </button>

                        <button
                            className="btn rounded-lg"
                            disabled={!allSelectedHasEvent}
                            onClick={() => setOpenBulkRemoveFromEvent(true)}
                        >
                            Remove from Event
                        </button>

                        <button
                            className="btn rounded-lg"
                            disabled={!allSelectedEventDone}
                            onClick={() => {
                                setSelectedStatus('Present');
                                setOpenBulkEditOrientationStatus(true);
                            }}
                        >
                            Mark as Present
                        </button>

                        <button
                            className="btn rounded-lg"
                            disabled={!allSelectedEventDone}
                            onClick={() => {
                                setSelectedStatus('Absent');
                                setOpenBulkEditOrientationStatus(true);
                            }}
                        >
                            Mark as Absent
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}