import { useState } from "react";

export function useForm(initialState) {
    const [formData, setFormData] = useState(initialState);

    const handleInputChange = (e) => {
        const { name, value, type, files, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                type === "file"
                    ? files[0]
                    : type === "checkbox"
                        ? checked
                        : value,
        }));
    };

    return { formData, setFormData, handleInputChange };
}
