import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import { createCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";

export default function AddCompany({ onClose }) {

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        location: '',
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { success, message } = await createCompany(formData);
            if (success) {
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Add New Company</p>
                <p className="text-sm text-gray-500 mb-8">
                    Enter company details to add to the system
                </p>

                <div className="mb-4">
                    <Input
                        label="Company Name"
                        required={true}
                        name="companyName"
                        placeholder="Enter company name"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Industry"
                        required={true}
                        name="industry"
                        placeholder="Select Industry"
                        options={industries.map(industry => ({ value: industry.value, name: industry.name }))}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-8">
                    <Input
                        label="Location"
                        required={true}
                        name="location"
                        placeholder="City, Province"
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-8">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white"
                        onClick={handleSubmit}
                    >
                        Add Admin
                    </button>
                </div>
            </div>
        </div>
    );
}
