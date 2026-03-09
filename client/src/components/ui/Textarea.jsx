export default function Textarea({
    label,
    required = false,
    name,
    value = "",
    placeholder,
    onChange = () => { },
    minLength,
    maxLength,
}) {
    // Count only non-space characters if you want, otherwise use value.length
    const charCount = value.length;

    return (
        <div>
            {label && (
                <p className="input-label mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </p>
            )}

            <textarea
                name={name}
                placeholder={placeholder}
                minLength={minLength}
                maxLength={maxLength}
                value={value}
                className="textarea w-full resize-none field-sizing-content"
                onChange={onChange}
            />

            {(minLength || maxLength) && (
                <p className="text-xs text-gray-500 mt-1 text-right">
                    {minLength && `${charCount} / ${minLength} min`}{" "}
                    {minLength && maxLength && "|"}{" "}
                    {maxLength && `${charCount} / ${maxLength} max`}
                </p>
            )}
        </div>
    );
}
