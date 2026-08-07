export default function ItemSelector({
    label,
    required = false,
    items = [],
    itemSelected,
    onChange,
}) {
    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`btn btn-sm ${item.item === itemSelected ? 'bg-blue-400 text-white' : ''
                            } rounded-full`}
                        onClick={() => onChange(item)}
                    >
                        {item.item}
                    </button>
                ))}
            </div>
        </div>
    );
}