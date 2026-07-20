/* eslint-disable no-unused-vars */
import { Inbox } from "lucide-react";

export default function NoData({
    message = "No data found",
    description,
    icon: Icon = Inbox,
    action,
}) {
    return (
        <div className="bg-gray-50 py-12 px-4 flex-center flex-col gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-white flex-center shadow-sm">
                <Icon size={24} className="text-gray-300" strokeWidth={1.5} />
            </div>

            <div className="max-w-xs">
                <p className="text-gray-600 font-medium">{message}</p>
                {description && (
                    <p className="text-gray-400 text-sm mt-1">{description}</p>
                )}
            </div>

            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}