export default function Textarea({
    label,
    required = false,
    name,
    value = '',
    placeholder,
    onChange = () => { }
}) {
    return (
        <>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <textarea
                name={name}
                placeholder={placeholder}
                value={value}
                className="textarea w-full resize-none field-sizing-content"
                onChange={onChange}
            />
        </>
    );
}