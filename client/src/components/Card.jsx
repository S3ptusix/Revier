import {
    Banknote,
    Bookmark,
    Clock,
    MapPin,
    NotepadText,
} from "lucide-react";
import { formatPostedDate } from "../utils/format-datetime";
import { formatPayType } from "../utils/format-word";
import { formatCompactNumber } from "../utils/format-money";

export default function Card({
    job,
    showDetails = () => { },
    handleSaveJob = () => { },
    savedJobsList = [],
    selectedJob = "",
}) {
    const isSelected = selectedJob === job?.id;
    const isSaved = savedJobsList.includes(job?.id);

    return (
        <div
            onClick={() => showDetails(job?.id)}
            className={`
                group relative cursor-pointer rounded-xl border p-5 transition-all duration-300
                ${isSelected
                    ? "border-emerald-400 bg-emerald-50/60 shadow-md ring-2 ring-emerald-100"
                    : "border-gray-200 bg-white hover:border-emerald-200 hover:shadow-md hover:-translate-y-0.5"
                }
            `}
        >
            {/* Save Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleSaveJob(job?.id);
                }}
                className={`
                    cursor-pointer absolute right-3 top-3 rounded-full p-2 transition-colors
                    ${isSaved
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-gray-300 hover:bg-gray-100 hover:text-amber-500"
                    }
                `}
                title={isSaved ? "Remove bookmark" : "Save job"}
            >
                <Bookmark
                    size={18}
                    fill={isSaved ? "currentColor" : "none"}
                />
            </button>

            {/* Header */}
            <div className="pr-10">
                <h2 className="text-lg font-semibold text-gray-900 leading-snug">
                    {job?.jobTitle}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                    {job?.company?.companyName}
                </p>
            </div>

            {/* Job Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <MapPin size={13} />
                    {job?.company?.location}
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
                    <NotepadText size={13} />
                    {job?.type}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
                {job?.payType ? (
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-emerald-700">
                        <Banknote size={14} className="shrink-0" />

                        <span className="text-sm font-semibold whitespace-nowrap">
                            ₱{formatCompactNumber(job?.payMin)}

                            {job?.payMin !== job?.payMax &&
                                ` - ₱${formatCompactNumber(job?.payMax)}`}

                            {" "}
                            {formatPayType(job?.payType)}
                        </span>
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Clock size={13} />
                    {formatPostedDate(job?.postedAt)}
                </div>
            </div>
        </div>
    );
}