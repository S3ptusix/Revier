import { Bookmark, Clock, MapPin } from "lucide-react";
import { formatPostedDate } from "../utils/format";

export default function Card({ job, showDetails = () => { } }) {

    return (
        <div
            className="relative flex gap-2 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200"
            onClick={() => showDetails(job?.id)}
        >
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">{(job?.company?.companyName[0] || '').toUpperCase()}</p>
            <div className="w-full">
                <p className="text-lg font-semibold">{job?.jobTitle}</p>
                <p className="text-sm text-gray-500">{job?.company?.companyName}</p>
                <div className="flex items-center gap-1 text-gray-500 mb-4">
                    <MapPin size={12} className="shrink-0" />
                    <p className="text-sm">{job?.company?.location} • {job?.type}</p>
                </div>
                <div className="flex justify-end items-center gap-1 text-gray-500">
                    <Clock size={12} className="shrink-0" />
                    <p className="text-sm">{formatPostedDate(job?.postedAt)}</p>
                </div>
            </div>
            <button className="absolute top-4 right-4 cursor-default text-gray-500">
                <Bookmark size={16} className="shrink-0" />
            </button>
        </div>
    )
}