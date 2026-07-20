export default function Input({
    label,
    required = false,
    name,
    type = "text",
    placeholder,
    value = "",
    onChange = () => { },
    disabled = false,
    error = "",
    helperText = "",
    icon: Icon = null,
}) {
    return (
        <div className="form-control w-full">
            {/* LABEL */}
            {label && (
                <label className="label">
                    <span className="label-text font-medium">
                        {label}
                        {required && (
                            <span className="text-error ml-1">*</span>
                        )}
                    </span>
                </label>
            )}

            {/* INPUT */}
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                )}

                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
                        input input-bordered w-full
                        ${Icon ? "pl-9" : ""}
                        ${error ? "input-error" : ""}
                    `}
                />
            </div>

            {/* ERROR / HELPER */}
            {error ? (
                <label className="label">
                    <span className="label-text-alt text-error">
                        {error}
                    </span>
                </label>
            ) : helperText ? (
                <label className="label">
                    <span className="label-text-alt">
                        {helperText}
                    </span>
                </label>
            ) : null}
        </div>
    );
}