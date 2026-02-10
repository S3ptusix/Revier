export default function Textarea({ label, required = false, name, placeholder, onChange = () => { } }) {
    return (
        <>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <textarea
                name={name}
                placeholder={placeholder}
                className="textarea w-full resize-none field-sizing-content"
                onChange={onChange}
            />
        </>
    );
}