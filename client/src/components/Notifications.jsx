import { useEffect, useState } from "react";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { notifications } from "../services/userServices";
import { cleanDateTime } from "../utils/format";
import Pagination from "./Pagination";
import { Bell } from "lucide-react";
import { socket } from "../socket";

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

    useEffect(() => {
        const handleNewNotification = (notification) => {
            console.log("🔔 New notification:", notification);

            // ✅ add new notification on top
            setData((prev) => [notification, ...prev]);

            // ✅ update total count
            setPagination((prev) => ({
                ...prev,
                total: prev.total + 1
            }));
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, []);

    return (
        <ModalBackground>
            <Modal maxWidth={500}>
                <div className="h-full flex flex-col">

                    <ModalHeader
                        title="Notifications"
                        onClose={onClose}
                    />

                    {/* LIST */}
                    <div className="grow overflow-auto space-y-4 pr-1">

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

                                const typeStyles = {
                                    success: "bg-emerald-100 text-emerald-600",
                                    error: "bg-red-100 text-red-600",
                                    warning: "bg-yellow-100 text-yellow-600",
                                    info: "bg-blue-100 text-blue-600",
                                };

                                const style =
                                    typeStyles[notification?.type] || "bg-gray-100 text-gray-600";

                                return (
                                    <div key={notification.id || index}>

                                        {/* DATE HEADER */}
                                        {showDate && (
                                            <p className="text-xs font-semibold text-gray-400 uppercase mt-4">
                                                {date}
                                            </p>
                                        )}

                                        {/* CARD */}
                                        <div className="flex gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">

                                            {/* ICON */}
                                            <div className={`${style} h-fit p-2 rounded-full`}>
                                                <Bell size={16} />
                                            </div>

                                            {/* CONTENT */}
                                            <div className="flex-1 space-y-1">

                                                <div className="flex justify-between items-start gap-2">
                                                    <p className="font-semibold text-sm">
                                                        {notification?.title}
                                                    </p>

                                                    <span className="text-xs text-gray-400 shrink-0">
                                                        {time}
                                                    </span>
                                                </div>

                                                {notification?.subTitle && (
                                                    <p className="text-xs text-gray-500">
                                                        {notification.subTitle}
                                                    </p>
                                                )}

                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {notification?.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-12 text-gray-400">
                                <Bell size={48} className="mb-2 opacity-30" />
                                <p className="font-semibold">No notifications yet</p>
                                <p className="text-sm">You're all caught up 🎉</p>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {data.length > 0 && (
                        <div className="pt-4">
                            <Pagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </ModalBackground>
    );
}