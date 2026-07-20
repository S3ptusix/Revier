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
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSelectApplicant = (applicant) => {
        setSelectedApplicant(applicant);
        setShowConfirmModal(true);
    };

    const handleConfirmMove = async () => {
        if (!selectedApplicant) return;

        setLoading(true);

        try {
            await handleMoveApplicant(selectedApplicant.id);

            setShowConfirmModal(false);
            setSelectedApplicant(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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
                                                            className="absolute -top-1 -right-1 tooltip rounded-full bg-red-500 p-0.5 text-white"
                                                            data-tip="Blacklisted"
                                                        >
                                                            <Ban size={16} />
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
                                                        onClick={() =>
                                                            handleSelectApplicant(
                                                                applicant
                                                            )
                                                        }
                                                    >
                                                        <ArrowRight size={16} />
                                                        Move to Interview
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

            {showConfirmModal && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Move to Interview"
                            onClose={() => {
                                setShowConfirmModal(false);
                                setSelectedApplicant(null);
                            }}
                        />

                        <div className="space-y-6">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to move this applicant to
                                the <strong>Interview</strong> stage?
                            </p>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <p className="font-semibold">
                                    {selectedApplicant?.firstName}{" "}
                                    {selectedApplicant?.lastName}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {selectedApplicant?.job?.jobTitle}
                                </p>

                                <p className="text-sm text-gray-600">
                                    {
                                        selectedApplicant?.job?.company
                                            ?.companyName
                                    }
                                </p>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowConfirmModal(false);
                                        setSelectedApplicant(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={loading}
                                    onClick={handleConfirmMove}
                                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Moving..."
                                        : "Move to Interview"}
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}