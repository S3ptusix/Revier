import { Check } from "lucide-react";

/**
 * 🔥 Step Progress
 * Compact progress tracker shown at the top of every page in the
 * interview-message wizard (Details -> Compose the Note -> Preview) so the
 * user always knows where they are and how many steps are left.
 */
export default function StepProgress({ step, totalSteps = 3 }) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="flex items-center mb-4" aria-label={`Step ${step} of ${totalSteps}`}>
            {steps.map((num, index) => {
                const isDone = step > num;
                const isActive = step === num;

                return (
                    <div key={num} className="flex items-center flex-1 last:flex-none">
                        <span
                            className={[
                                "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold shrink-0 transition-colors",
                                isDone
                                    ? "bg-emerald-600 text-white"
                                    : isActive
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-500",
                            ].join(" ")}
                        >
                            {isDone ? <Check size={12} /> : num}
                        </span>
                        {index < steps.length - 1 && (
                            <div
                                className={[
                                    "flex-1 h-0.5 mx-2 transition-colors",
                                    step > num ? "bg-emerald-500" : "bg-gray-200",
                                ].join(" ")}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}