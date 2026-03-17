import { X } from "lucide-react";
import { useState } from "react";
import { handleRegister } from "../services/adminServices";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";

export default function AddAdmin({ onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        role: ''
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
            const { success, message } = await handleRegister(formData);
            if (success) {
                loadAfter();
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
                <p className="text-lg font-semibold">Add New Administrator</p>
                <p className="text-sm text-gray-500 mb-8">
                    Create a new admin account with specific role and permissions
                </p>

                <div className="mb-4">
                    <Input
                        label="Full Name"
                        required={true}
                        name="fullname"
                        placeholder="Jahleel Casintahan"
                        value={formData.fullname}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Email Address"
                        required={true}
                        type="email"
                        name="email"
                        placeholder="admin@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <p className="input-label mb-1">Role  <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-2  mb-4">
                    <InputCheck
                        type="radio"
                        name="role"
                        label="HR Manager"
                        value="HR Manager"
                        checked={formData.role === 'HR Manager'}
                        onChange={handleInputChange}
                    />
                    <InputCheck
                        type="radio"
                        name="role"
                        label="HR Associate"
                        value="HR Associate"
                        checked={formData.role === 'HR Associate'}
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
