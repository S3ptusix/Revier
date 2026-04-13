import { useEffect } from "react";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { notifications } from "../services/userServices";
import { useState } from "react";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";

export default function Notifications({ onClose = () => { } }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, notifications: apiNotifications, pagination: apiPagination } = await notifications({ page });
                if (success) {
                    setData(apiNotifications);
                    setPagination(apiPagination);
                    return
                };
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [page]);

    return (
        <ModalBackground>
            <Modal className="h-full">
                <div className="h-full flex flex-col space-y-4">
                    <ModalHeader
                        title="Notifications"
                        onClose={onClose}
                    />
                    <div className="grow space-y-2 overflow-auto">
                        {data.length > 0 ?
                            data?.map((notification, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 rounded-lg p-2 space-y-4"
                                >
                                    <p className="text-sm">{notification?.message}</p>
                                    <p className="text-sm text-end">{notification?.createdAt ? cleanDateTime(notification?.createdAt) : '-'}</p>
                                </div>
                            )) :
                            <p className="text-gray-500 font-semibold text-center p-4 bg-gray-100 rounded-lg">NO NEW NOTIFICATION</p>
                        }
                    </div>

                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </Modal>
        </ModalBackground>
    )
}