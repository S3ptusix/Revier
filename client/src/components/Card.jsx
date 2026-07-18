import {
    Banknote,
    Bookmark,
    Clock,
    MapPin,
    NotepadText,
} from "lucide-react";
import {
    formatNumber,
    formatPayType,
    formatPostedDate,
} from "../utils/format";

export default function Card({
    job,
    showDetails = () => {},
    handleSaveJob = () => {},
    savedJobsList = [],
    selectedJob = "",
}) {
    const isSelected = selectedJob === job?.id;
    const isSaved = savedJobsList.includes(job?.id);

    return (
        <div
            onClick={() => showDetails(job?.id)}
            className={`
                bg-gray-50 relative cursor-pointer rounded-xl border p-5 transition-all duration-300
                ${
                    isSelected
                        ? "border-emerald-500 bg-emerald-50 shadow-lg ring-2 ring-emerald-200"
                        : "border-gray-200 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5"
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
                    absolute right-4 top-4 rounded-lg p-2 transition-colors
                    ${
                        isSaved
                            ? "text-yellow-500 hover:bg-yellow-50"
                            : "text-gray-400 hover:bg-gray-100 hover:text-yellow-500"
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
                <h2 className="text-lg font-semibold">
                    {job?.jobTitle}
                </h2>

                <p className="mt-1 text-gray-600">
                    {job?.company?.companyName}
                </p>
            </div>

            {/* Job Tags */}
            <div className="mt-5 flex flex-wrap gap-2">
                <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <MapPin size={14} />
                    {job?.company?.location}
                </div>

                <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm">
                    <NotepadText size={14} />
                    {job?.type}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex items-end justify-between border-t pt-4">
                {job?.payType ? (
                    <div className="rounded-lg bg-emerald-100 px-3 py-2">
                        <div className="flex items-center gap-2 text-emerald-700">
                            <Banknote size={15} />

                            <span className="font-semibold">
                                ₱{formatNumber(job?.payMin)}

                                {job?.payMin !== job?.payMax &&
                                    ` - ₱${formatNumber(job?.payMax)}`}

                                {" "}
                                {formatPayType(job?.payType)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    {formatPostedDate(job?.postedAt)}
                </div>
            </div>
        </div>
    );
}