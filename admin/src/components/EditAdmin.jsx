/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin } from "../services/adminServices";
import { toast } from "react-toastify";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";

export default function EditAdmin({ adminId, onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({ role: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { success, message } = await editAdmin(adminId, formData);
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

    useEffect(() => {
        const loadData = async () => {
            const { success, message, admin } = await fetchOneAdmin(adminId);
            if (success) return setFormData(admin);
            setErrorMessage(message);
        }

        loadData();
    }, []);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Edit Administrator</p>

                <p className="input-label mb-1">Role  <span className="text-red-500">*</span></p>
                <div className="grid grid-cols-2  mb-8">
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
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
