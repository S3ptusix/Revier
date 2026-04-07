export default function Input({
    disabled = false,
    label,
    type = "text",
    min,
    max,
    required = false,
    name,
    placeholder,
    value = '',
    onChange = () => { }
}) {
    return (
        <>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <input
                disabled={disabled}
                type={type}
                min={min}
                max={max}
                name={name}
                placeholder={placeholder}
                value={value}
                className="input w-full"
                onChange={onChange}
            />
        </>
    );
}