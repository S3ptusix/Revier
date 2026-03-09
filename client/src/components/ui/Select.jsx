export default function Select({ label, required = false, name, placeholder, options = [], onChange = () => { } }) {
    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <select
                name={name}
                className="select w-full"
                onChange={onChange}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.name}</option>
                ))}
            </select>
        </div>
    );
}