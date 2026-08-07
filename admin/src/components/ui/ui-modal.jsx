import { AlertTriangle, X } from "lucide-react";

export function Modal({ maxWidth = 500, children }) {
    return (
        <div
            className="sm:rounded-lg bg-white max-h-full flex flex-col"
            style={{ width: `min(100%, ${maxWidth}px)` }}
        >
            {children}
        </div>
    );
}

export function ModalBackground({ children }) {

    return (
        <div className="sm:p-4 fixed inset-0 bg-black/25 backdrop-blur-lg flex-center z-999">
            {children}
        </div>
    )
}

export function ModalHeader({
    icon: Icon = "",
    title = "",
    subTitle = "",
    onClose = null
}) {
    return (
        <div className="p-4 border-b border-gray-300 flex gap-3">
            <div className="grow flex items-start gap-4">
                {Icon &&
                    <div className="bg-gray-200 text-gray-500 p-2 rounded-lg">
                        <Icon />
                    </div>
                }
                <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-gray-500 text-xs">{subTitle}</p>
                </div>
            </div>
            {onClose && (
                <button
                    type="button"
                    className="cursor-pointer h-fit"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>

            )}
        </div>
    );
}

export function ModalBody({ children }) {

    return (
        <div className="space-y-4 p-4 overflow-auto">
            {children}
        </div>
    )
}

export function ModalBodyError({
    // eslint-disable-next-line no-unused-vars
    icon: Icon = AlertTriangle,
    title,
    subTitle,
    effectList = [],
    children,
}) {
    return (
        <div className="space-y-4 p-4 overflow-auto">
            {/* Icon + heading */}
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <Icon className="h-5 w-5 text-red-600" strokeWidth={2} />
                </div>
                <div className="pt-1">
                    {title && (
                        <h3 className="text-base font-semibold text-gray-900">
                            {title}
                        </h3>
                    )}
                    {subTitle && (
                        <p className="mt-1 text-sm text-gray-500">{subTitle}</p>
                    )}
                </div>
            </div>

            {/* Effects / consequences */}
            {effectList.length > 0 && (
                <div className="rounded-lg border border-red-100 bg-red-50/60 p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-red-700">
                        This will
                    </p>
                    <ul className="space-y-1.5">
                        {effectList.map((effect, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-red-700"
                            >
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                                <span>{effect}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


            {children}
        </div>
    );
}

const COLOR_MAP = {
    RED: "text-white bg-red-500",
    BLUE: "text-white bg-blue-500",
    YELLOW: "text-white bg-yellow-500",
    GREEN: "text-white bg-emerald-500"
};

const getColorClass = (color, fallback) => {
    return COLOR_MAP[color] || fallback;
};

export function ModalFooter({
    cancelIcon: CancelIcon = null,
    cancelLabel = "Cancel",
    onClose = null,
    disableCancel = false,
    cancelColor = null,

    submitIcon: SubmitIcon = null,
    submitLabel = "Submit",
    onSubmit = () => { },
    disableSubmit = false,
    submitColor = null
}) {
    return (
        <div className="flex justify-end gap-4 p-4 border-t border-gray-300">

            {onClose && (
                <button
                    disabled={disableCancel}
                    onClick={onClose}
                    className={`btn rounded-xl disabled:brightness-50 ${getColorClass(cancelColor, "")
                        }`}
                >
                    {CancelIcon && <CancelIcon className="mr-2" size={16} />}
                    {cancelLabel}
                </button>
            )}

            <button
                disabled={disableSubmit}
                onClick={onSubmit}
                className={`btn rounded-xl disabled:brightness-50 ${getColorClass(submitColor, "text-white bg-emerald-500")
                    }`}
            >
                {SubmitIcon && <SubmitIcon className="mr-2" size={16} />}
                {submitLabel}
            </button>

        </div>
    );
}

export function InfoList({ infoList = [], label = 'This will' }) {
    if (infoList.length === 0) return null;

    return (
        <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-blue-700">
                {label}
            </p>
            <ul className="space-y-1.5">
                {infoList.map((info, i) => (
                    <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-blue-700"
                    >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                        <span>{info}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}