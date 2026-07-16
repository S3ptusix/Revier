import { FileText, Eye, Pencil } from "lucide-react";

export default function ApplicationCard({
  application,
  handleShowEditApplication = () => {},
  handleViewApplicantDetails = () => {},
}) {
  const isRejected = application?.isRejected === "Yes";
  const statusText = isRejected
    ? "Rejected"
    : application?.applicantStatus;

  // 🎨 Status styles
  const getStatusStyle = () => {
    if (isRejected) return "bg-red-100 text-red-500";
    if (statusText === "New") return "bg-blue-100 text-blue-500";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="border border-gray-200 bg-gray-50 group relative flex gap-4 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">

      {/* Icon */}
      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gray-100 text-gray-500">
        <FileText size={20} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <p className="text-lg font-semibold truncate">
          {application?.job?.jobTitle}
        </p>

        {/* Company */}
        <p className="text-sm text-gray-500 mb-2 truncate">
          {application?.job?.company?.companyName}
        </p>

        {/* Status */}
        <div className="mb-3">
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusStyle()}`}
          >
            {statusText}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          {/* Primary */}
          <button
            className="btn bg-emerald-500 text-white rounded-lg flex items-center gap-1"
            onClick={() =>
              handleViewApplicantDetails(application?.id)
            }
          >
            <Eye size={14} />
            View
          </button>

          {/* Secondary */}
          {application?.applicantStatus === "New" &&
            !isRejected && (
              <button
                className="btn bg-gray-100 text-gray-700 rounded-lg flex items-center gap-1 hover:bg-gray-200"
                onClick={() =>
                  handleShowEditApplication(application?.id)
                }
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
        </div>
      </div>
    </div>
  );
}