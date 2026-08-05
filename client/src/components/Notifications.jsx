import { useEffect, useState } from "react";
import { Modal, ModalBackground, ModalBody, ModalHeader } from "./ui/ui-modal";
import { notifications } from "../services/userServices";
import Pagination from "./Pagination";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
import { socket } from "../socket";
import { cleanDateTime, formatReadableDate, toStandardTimeFull } from "../utils/format-datetime";

// Messages longer than this get truncated with a "See more" toggle.
const MESSAGE_PREVIEW_LIMIT = 120;

export default function Notifications({ onClose = () => { } }) {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });
    // Tracks which notification IDs (or index fallback) are expanded.
    const [expandedIds, setExpandedIds] = useState(new Set());

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

    const toggleExpanded = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <ModalBackground>
            <Modal>
                <ModalHeader
                    title="Notifications"
                    onClose={onClose}
                />
                <ModalBody>


                    {/* LIST */}
                    <div className="grow overflow-auto space-y-1 pr-1 -mr-1">

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

                                const notificationId = notification.id ?? index;
                                const message = notification?.message || "";
                                const isLong = message.length > MESSAGE_PREVIEW_LIMIT;
                                const isExpanded = expandedIds.has(notificationId);
                                const displayMessage = isLong && !isExpanded
                                    ? `${message.slice(0, MESSAGE_PREVIEW_LIMIT).trimEnd()}…`
                                    : message;

                                return (
                                    <div key={notificationId}>

                                        {/* DATE HEADER */}
                                        {showDate && (
                                            <p className={`text-xs font-semibold text-gray-400 uppercase tracking-wide ${index === 0 ? 'mb-2' : 'mt-5 mb-2'}`}>
                                                {formatReadableDate(date)}
                                            </p>
                                        )}

                                        {/* CARD */}
                                        <div className="group flex gap-3 bg-white border border-gray-200 rounded-xl p-3.5 mb-2 shadow-sm transition-all hover:shadow-md hover:border-gray-300">

                                            {/* ICON */}
                                            <span className={`${style} h-9 w-9 flex items-center justify-center rounded-full shrink-0`}>
                                                <Bell size={16} />
                                            </span>

                                            {/* CONTENT */}
                                            <div className="flex-1 min-w-0 space-y-0.5">

                                                <div className="flex justify-between items-start gap-3">
                                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                                        {notification?.title}
                                                    </p>

                                                    <span className="text-xs text-gray-400 shrink-0 pt-0.5">
                                                        {toStandardTimeFull(time)}
                                                    </span>
                                                </div>

                                                {notification?.subTitle && (
                                                    <p className="text-xs font-medium text-gray-500">
                                                        {notification.subTitle}
                                                    </p>
                                                )}

                                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                    {displayMessage}
                                                </p>

                                                {isLong && (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleExpanded(notificationId)}
                                                        className="cursor-pointer flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 pt-0.5"
                                                    >
                                                        {isExpanded ? (
                                                            <>
                                                                See less
                                                                <ChevronUp size={12} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                See more
                                                                <ChevronDown size={12} />
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
                                <div className="h-14 w-14 flex items-center justify-center rounded-full bg-gray-100 mb-3">
                                    <Bell size={24} className="opacity-40" />
                                </div>
                                <p className="font-semibold text-gray-500">No notifications yet</p>
                                <p className="text-sm">You're all caught up 🎉</p>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {data.length > 0 && (
                        <div className="pt-4 border-t border-gray-100 mt-2">
                            <Pagination
                                pagination={pagination}
                                page={page}
                                setPage={setPage}
                            />
                        </div>
                    )}
                </ModalBody>
            </Modal>
        </ModalBackground>
    );
}