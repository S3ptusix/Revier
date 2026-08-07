import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function TagInput({
    label,
    required = false,
    value = [],
    setValue = () => { },
    placeholder = "",
}) {
    const [input, setInput] = useState("");
    const [isDuplicate, setIsDuplicate] = useState(false);

    const commit = () => {
        const trimmed = input.trim();
        if (trimmed === "") return;
        if (value.includes(trimmed)) {
            setIsDuplicate(true);
            return;
        }
        setValue([...value, trimmed]);
        setInput("");
        setIsDuplicate(false);
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        if (isDuplicate) setIsDuplicate(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commit();
        } else if (e.key === "Backspace" && input === "" && value.length > 0) {
            setValue(value.slice(0, -1));
        }
    };

    const handleRemove = (item) => {
        setValue(value.filter((v) => v !== item));
    };

    return (
        <div>
            {label && <p className="input-label mb-1">{label} {required && <span className="text-red-500">*</span>}</p>}

            <div
                className={[
                    "flex flex-wrap items-center gap-1.5 w-full min-h-11 px-2 py-1.5 rounded-lg",
                    "bg-gray-50 border transition-colors",
                    isDuplicate
                        ? "border-red-400 ring-2 ring-red-100"
                        : "border-gray-200 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-gray-100",
                ].join(" ")}
            >
                {value.map((item) => (
                    <span
                        key={item}
                        className="group flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-gray-200 text-sm text-gray-700 shadow-sm"
                    >
                        {item}
                        <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            aria-label={`Remove ${item}`}
                            className="p-0.5 rounded-full text-gray-400 cursor-pointer hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <X size={12} />
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={input}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-20 bg-transparent text-sm outline-none py-1 placeholder:text-gray-400"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />

                <button
                    type="button"
                    onClick={commit}
                    disabled={input.trim() === ""}
                    aria-label="Add tag"
                    className="flex items-center justify-center w-7 h-7 rounded-full text-gray-500 cursor-pointer hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            {isDuplicate && (
                <p className="mt-1 text-xs text-red-500">
                    "{input.trim()}" is already added
                </p>
            )}
        </div>
    );
}