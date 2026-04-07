import { useEffect } from "react";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { notifications } from "../services/userServices";
import { useState } from "react";
import { cleanDateTime } from "../utils/format";

export default function Notifications({ onClose = () => { } }) {
    const [data, setData] = useState([]);
    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, notifications: apiNotifications } = await notifications();
                if (success) return setData(apiNotifications);
                console.error(message);
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, []);

    return (
        <ModalBackground>
            <Modal>
                <section className="space-y-2">
                    <ModalHeader
                        title="Notifications"
                        onClose={onClose}
                    />
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
                </section>
            </Modal>
        </ModalBackground>
    )
}