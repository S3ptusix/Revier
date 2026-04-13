import { Bookmark, Clock, MapPin, NotepadText, User } from "lucide-react";
import { formatPostedDate } from "../utils/format";

export default function Card({
    job,
    showDetails = () => { },
    handleSaveJob = () => { },
    savedJobsList = [],
    selectedJob = ''
}) {

    const isSelected = selectedJob === job?.id;

    return (
        <div className={`relative flex gap-2 border border-gray-200 rounded-lg p-4 duration-200 ${isSelected ? 'bg-emerald-500 text-white' : 'text-gray-500'}`}>
            <p className={"flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500"}>{(job?.company?.companyName[0] || '').toUpperCase()}</p>
            <div className="w-full">
                <p
                    className={`text-lg font-semibold hover:underline cursor-pointer w-fit ${isSelected ? 'hover:text-white' : 'hover:text-emerald-500'}`}
                    onClick={() => showDetails(job?.id)}
                >
                    {job?.jobTitle}

                </p>
                <p className="text-sm">{job?.company?.companyName}</p>
                <div className="mb-4">
                    <div className="flex items-center gap-1">
                        <MapPin size={12} className="shrink-0" />
                        <p className="text-sm">{job?.company?.location}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <NotepadText size={12} className="shrink-0" />
                        <p className="text-sm">{job?.type}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <User size={12} className="shrink-0" />
                        <p className="text-sm">Slot: {job?.slot}</p>
                    </div>
                </div>
                <div className="flex justify-end items-center gap-1">
                    <Clock size={12} className="shrink-0" />
                    <p className="text-sm">{formatPostedDate(job?.postedAt)}</p>
                </div>
            </div>
            <button
                className="absolute top-4 right-4 cursor-pointer"
                onClick={() => handleSaveJob(job?.id)}
            >
                <Bookmark
                    size={16}
                    className="shrink-0"
                    fill={savedJobsList.includes(job?.id) ? "currentColor" : "none"}
                />
            </button>
        </div>
    )
}