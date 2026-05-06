import { X } from "lucide-react";
import { useState } from "react";
import { handleRegister } from "../services/adminServices";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";
import VerifyEmail from "./VerifyEmail";

export default function AddAdmin({ onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: 'Male',
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
                setOpenVerifyEmail(true);
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    return (
        <>
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
                            label="First Name"
                            required={true}
                            type="text"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Last Name"
                            required={true}
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <p className="input-label mb-1">Sex<span className="text-red-500">*</span></p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                className={`btn rounded-xl bg-blue-500 text-white ${formData.sex === 'Male' ? '' : 'opacity-50 brightness-75'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                            >
                                <p>Male</p>
                            </button>
                            <button
                                className={`btn rounded-xl bg-pink-500 text-white ${formData.sex === 'Female' ? '' : 'opacity-50 brightness-75'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                            >
                                <p>Female</p>
                            </button>
                        </div>
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
            {
                openVerifyEmail &&
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={onClose}
                />
            }
        </>
    );
}
