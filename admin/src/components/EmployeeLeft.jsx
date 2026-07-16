import { toast } from "react-toastify";
import { isRejected } from "../services/applicants";
import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";

export default function EmployeeLeft({
  applicantId,
  applicantName = "this employee",
  onClose = () => {},
  loadAfter = () => {},
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const { success, message } = await isRejected(applicantId);

      if (success) {
        toast.success("Employee marked as resigned");
        loadAfter();
        onClose();
        return;
      }

      toast.error(message || "Something went wrong");
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-style">
      <div className="max-w-md w-full">

        {/* Icon + Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-red-100 text-red-500 p-3 rounded-full mb-4">
            <AlertTriangle size={20} />
          </div>

          <p className="text-lg font-semibold">
            Confirm Resignation
          </p>

          <p className="text-sm text-gray-500 mt-1">
            You are about to mark{" "}
            <span className="font-medium text-gray-700">
              {applicantName}
            </span>{" "}
            as resigned.
          </p>
        </div>

        {/* Warning */}
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6 text-center">
          This action may affect reports and cannot be easily undone.
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="btn flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            className="flex-1 btn bg-red-500 text-white flex items-center justify-center gap-2 disabled:opacity-70"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}