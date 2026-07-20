export default function Select({
    label,
    required = false,
    name,
    placeholder,
    options = [],
    value = "",
    onChange = () => { },
    disabled = false,
    error = "",
    helperText = "",
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

            {/* SELECT */}
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
                    select select-bordered w-full
                    ${error ? "select-error" : ""}
                `}
            >
                {placeholder && (
                    <option value="">
                        {placeholder}
                    </option>
                )}

                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>

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