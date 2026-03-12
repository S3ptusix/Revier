export default function Checkbox({ name = '', label = '', checked, onChange = () => {} }) {

    return (
        <div className="flex items-center gap-2">
            <input
                type="radio"
                name={name}
                checked={checked}
                onChange={onChange}
            />
            <p className="text-sm">{label}</p>
        </div>
    )
}