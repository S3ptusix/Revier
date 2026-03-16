export default function Input({ disabled = false, label, type = "text", required = false, name, value = '', placeholder, onChange = () => { }, accept = '' }) {
    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <input
                disabled={disabled}
                type={type}
                name={name}
                value={value}
                placeholder={placeholder}
                accept={accept}
                className={`${type === 'file' ? 'file-input' : 'input'} w-full`}
                onChange={onChange}
            />
        </div>
    );
}