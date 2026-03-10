import { X } from "lucide-react";

export function Modal({ maxWidth = 450, children }) {
    return (
        <div
            className="p-8 rounded-xl bg-white max-h-screen overflow-auto"
            style={{ width: `min(100%, ${maxWidth}px)` }}
        >
            {children}
        </div>
    );
}


export function ModalBackground({ children }) {

    return (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-lg flex-center z-999">
            {children}
        </div>
    )
}

export function ModalHeader({
    icon: Icon = '',
    title = "",
    subTitle = "",
    onClose = () => { }
}) {
    return (
        <div className="flex gap-3">
            <div className="grow flex items-start gap-4">
                {Icon &&
                    <div className="bg-emerald-100 text-emerald-500 p-2 rounded-lg">
                        <Icon />
                    </div>
                }
                <div>
                    <p className="text-xl font-semibold">{title}</p>
                    <p className="text-gray-500 text-sm">{subTitle}</p>
                </div>
            </div>

            <button
                type="button"
                className="cursor-pointer h-fit"
                onClick={onClose}
            >
                <X size={20} />
            </button>
        </div>
    );
}

export function ModalFooter
    ({
        cancelLabel = 'Cancel',
        submitLabel = 'Submit',
        onClose = () => { },
        onSubmit = () => { }
    }) {

    return (
        <div className="grid grid-cols-2 gap-4">
            <button
                className="btn btn-ghost rounded-xl"
                onClick={onClose}
            >
                {cancelLabel}
            </button>
            <button
                className="btn btn-ghost rounded-xl bg-emerald-500 text-white"
                onClick={onSubmit}
            >
                {submitLabel}
            </button>
        </div>
    )
}