import { FileText } from "lucide-react";

export default function ApplicationCard({
    application,
    handleShowEditApplication = () => { },
    handleViewApplicantDetails = () => { }
}) {

    return (
        <div className="relative flex gap-2 outline-1 -outline-offset-1 outline-gray-300 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200">
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">
                <FileText className="shrink-0" />
            </p>
            <div className="w-full">
                <p className="text-lg font-semibold">{application?.job?.jobTitle}</p>
                <p className="text-gray-500 mb-4">{application?.job?.company?.companyName}</p>
                <p className="mb-4">Application Status: {application?.isRejected === 'Yes' ? 'Rejected' : application?.applicantStatus}</p>
                <div className="flex gap-2 flex-wrap">
                    <button
                        className="btn bg-emerald-500 text-white rounded-lg"
                        onClick={() => handleViewApplicantDetails(application?.id)}
                    >
                        View Details
                    </button>
                    {
                        (application?.applicantStatus === "New" && application?.isRejected === 'No') && (
                            <button
                                className="btn bg-emerald-500 text-white rounded-lg"
                                onClick={() => handleShowEditApplication(application?.id)}
                            >
                                Edit Application
                            </button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}