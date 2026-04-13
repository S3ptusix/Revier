import { FileText } from "lucide-react";

export default function ApplicationCard({
    application,
    handleShowEditApplication = () => { },
    handleViewApplicantDetails = () => { }
}) {

    return (
        <div className="relative flex gap-2 border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg duration-200">
            <p className="flex-center font-semibold h-12 aspect-square rounded-lg bg-gray-200 text-gray-500">
                <FileText className="shrink-0" />
            </p>
            <div className="w-full">
                <p className="text-lg font-semibold">{application?.job?.jobTitle}</p>
                <p className="text-sm text-gray-500 mb-4">{application?.job?.company?.companyName}</p>
                <p className="text-sm mb-4">Application Status: {application?.isRejected === 'Yes' ? 'Rejected' : application?.applicantStatus}</p>
                <div className="space-x-2">
                    <button
                        className="btn"
                        onClick={() => handleViewApplicantDetails(application?.id)}
                    >
                        View Details
                    </button>
                    {
                        (application?.applicantStatus === "New" && application?.isRejected === 'No') && (
                            <button
                                className="btn"
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