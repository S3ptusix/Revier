import { Calendar, Clock, FileText } from "lucide-react";
import { cleanDateTime } from "../utils/format";

export default function ApplicationCard({ application }) {

    return (
        <div className="relative flex gap-2 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200">
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">
                <FileText className="shrink-0" />
            </p>
            <div className="w-full">
                <p className="text-lg font-semibold">{application?.job?.jobTitle}</p>
                <p className="text-sm text-gray-500 mb-4">{application?.job?.company?.companyName}</p>
                <div className="flex gap-2 items-center flex-wrap">                    
                    <p className="flex gap-2 items-center text-gray-500 text-sm">
                        <Calendar size={16} className="shrink-0" />
                        {cleanDateTime(application?.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    )
}