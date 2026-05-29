import { useEffect, useState } from "react";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { notifications } from "../services/userServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import { Bell } from "lucide-react";

export default function Notifications({ onClose = () => { } }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    useEffect(() => {
        const load = async () => {
            try {
                const {
                    success,
                    message,
                    notifications: apiNotifications,
                    pagination: apiPagination
                } = await notifications({ page });

                if (success) {
                    setData(apiNotifications);
                    setPagination(apiPagination);
                } else {
                    console.error(message);
                }
            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, [page]);

    return (
        <ModalBackground>
            <Modal>
                <div className="h-full flex flex-col space-y-4">
                    <ModalHeader
                        title="Notifications"
                        onClose={onClose}
                    />

                    <div className="grow overflow-auto">
                        {data.length > 0 ? (
                            data.map((notification, index) => {
                                const datetime = notification?.createdAt
                                    ? cleanDateTime(notification.createdAt)
                                    : null;

                                const [date, time] = datetime
                                    ? datetime.split(" ")
                                    : ["-", "-"];

                                const prevDate =
                                    index > 0 && data[index - 1]?.createdAt
                                        ? cleanDateTime(data[index - 1].createdAt).split(" ")[0]
                                        : null;

                                const showDate = date !== prevDate;

                                // ✅ MOVE THIS HERE
                                const typeStyles = {
                                    success: "bg-emerald-500/25 text-emerald-500",
                                    error: "bg-red-500/25 text-red-500",
                                    warning: "bg-yellow-500/25 text-yellow-500",
                                    info: "bg-blue-500/25 text-blue-500",
                                };

                                const style =
                                    typeStyles[notification?.type] || "bg-gray-500/25 text-gray-500";

                                return (
                                    <div key={notification.id || index}>
                                        {showDate && (
                                            <p className="font-semibold text-sm text-gray-500 mt-4 border-b border-gray-300 pb-4">
                                                {date}
                                            </p>
                                        )}

                                        <div className="border-b border-gray-300 p-2 flex gap-2">
                                            {/* ✅ Only ONE icon now */}
                                            <div className={`${style} h-fit p-2 rounded-full`}>
                                                <Bell size={16} />
                                            </div>

                                            <div className="space-y-2">
                                                <div>
                                                    <p className="font-semibold">{notification?.title}</p>
                                                    <p className="text-sm">{notification?.subTitle}</p>
                                                </div>

                                                <p className="text-sm">{notification?.message}</p>

                                                <p className="text-sm text-end text-gray-500">
                                                    {time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 font-semibold text-center p-4 bg-gray-100 rounded-lg">
                                NO NEW NOTIFICATION
                            </p>
                        )}
                    </div>

                    <Pagination
                        pagination={pagination}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </Modal>
        </ModalBackground>
    );
}