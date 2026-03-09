import { Calendar, Clock, FileText } from "lucide-react";

export default function ApplicationCard({ job }) {

    return (
        <div className="relative flex gap-2 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200">
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">
                <FileText className="shrink-0" />
            </p>
            <div className="w-full">
                <p className="text-lg font-semibold">{job?.jobTitle}</p>
                <p className="text-sm text-gray-500 mb-4">{job?.company?.companyName}</p>
                <div className="flex gap-2 items-center flex-wrap">
                    <span className="flex items-center w-fit gap-2 bg-blue-100 text-blue-500 text-sm py-1 px-4 rounded-full"><Clock size={16}/>New</span>
                    
                    <p className="flex gap-2 items-center text-gray-500 text-sm">
                        <Calendar size={16} className="shrink-0" />
                        Applied Feb 7, 2026
                    </p>
                </div>
            </div>
        </div>
    )
}