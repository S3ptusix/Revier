export default function InputCheck({
    type = "checkbox", // checkbox or radio
    name = "",
    label = "",
    value = "",
    checked = false,
    onChange = () => { },
    disabled = false,
    className = ""
}) {
    return (
        <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
            <input
                type={type}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
            />
            <span className="text-sm">{label}</span>
        </label>
    );
}