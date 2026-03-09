import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TagInput({ label, required = false, value = [], setValue = () => { }, placeholder = "" }) {
    const [input, setInput] = useState('');

    const handleAdd = () => {
        if (input.trim() !== '' && !value.includes(input.trim())) {
            setValue([...value, input.trim()]);
            setInput('');
        }
    }

    const handleRemove = (item) => {
        setValue(value.filter((v) => v !== item));
    }
    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}
            <div className="flex bg-gray-100 rounded-lg w-full">
                <input
                    type="text"
                    value={input}
                    placeholder={placeholder}
                    className="input grow"
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="btn btn-square btn-ghost rounded-lg cursor-pointer"
                    onClick={handleAdd}
                >
                    <Plus size={16} />
                </button>
            </div>
            {value.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {value.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-emerald-100 text-emerald-500 py-1 px-4 rounded-lg">
                            <span className="whitespace-normal break-all">{item}</span>
                            <button
                                className="cursor-pointer"
                                onClick={() => handleRemove(item)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div >
            )}
        </div>
    )
}