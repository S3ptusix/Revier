import { Calendar, FileText } from "lucide-react";
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
                {/* <p className="text-sm py-1 px-2 w-min rounded-lg border mb-4">{application?.applicantStatus}</p> */}
                {/* <div className="flex gap-2 items-center flex-wrap text-gray-500 mb-4">
                    <Calendar size={16} className="shrink-0" />
                    <p className="flex gap-2 items-center  text-sm">
                        {cleanDateTime(application?.createdAt)}
                    </p>
                </div> */}
                <div>
                    {application?.applicantStatusHistories?.map((history, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                            <div className="flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                <div className="bg-gray-300 w-0.5 grow"></div>
                            </div>
                            <div>
                                <p>{history?.applicantStatus}</p>
                                <p>{cleanDateTime(history?.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}