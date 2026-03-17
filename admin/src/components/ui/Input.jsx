export default function Input({
    disabled = false,
    label,
    type = "text",
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
                name={name}
                placeholder={placeholder}
                value={value}
                className="input w-full"
                onChange={onChange}
            />
        </>
    );
}