import { Banknote, Bookmark, Clock, MapPin, NotepadText, User } from "lucide-react";
import { formatNumber, formatPayType, formatPostedDate } from "../utils/format";

export default function Card({
    job,
    showDetails = () => { },
    handleSaveJob = () => { },
    savedJobsList = [],
    selectedJob = ''
}) {

    const isSelected = selectedJob === job?.id;

    return (
        <div className={`relative rounded-lg p-4 duration-200 shadow shadow-emerald-500 ${isSelected ? 'bg-emerald-500 text-white' : ''}`}>
            <div className="flex items-start gap-2 mb-4">
                <div className="grow">
                    <p
                        className={`text-lg font-semibold ${isSelected ? '' : ''} hover:underline cursor-pointer`}
                        onClick={() => showDetails(job?.id)}
                    >
                        {job?.jobTitle}
                    </p>
                    <p>{job?.company?.companyName}</p>
                </div>
                <button
                    onClick={() => handleSaveJob(job?.id)}
                    className={`shadow-none border-0 cursor-pointer ${isSelected ? 'text-white' : 'text-yellow-500'}`}
                >
                    <Bookmark
                        size={16}
                        className="shrink-0"
                        fill={savedJobsList.includes(job?.id) ? "currentColor" : "none"}
                    />
                </button>
            </div>
            <div className="mb-4">
                <div className="flex items-center gap-1">
                    <MapPin size={12} className="shrink-0" />
                    <p>{job?.company?.location}</p>
                </div>
                <div className="flex items-center gap-1">
                    <NotepadText size={12} className="shrink-0" />
                    <p>{job?.type}</p>
                </div>
            </div>
            <div className="flex justify-between items-end border-t pt-4">
                {job?.payType && (
                    <p className="font-semibold">
                        {job?.payType && (
                            <>
                                ₱{formatNumber(job?.payMin)}
                                {job?.payMin !== job?.payMax && ` - ₱${formatNumber(job?.payMax)}`}{" "}
                                {formatPayType(job?.payType)}
                            </>
                        )}
                    </p>
                )}
                <p className="text-sm font-semibold">{formatPostedDate(job?.postedAt)}</p>
            </div>
        </div>
    )
}