/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin } from "../services/adminServices";
import { toast } from "react-toastify";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";

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

                <div className="mb-4">
                    <Select
                        label="Role"
                        required={true}
                        name="role"
                        placeholder="Select Role"
                        value={formData.role}
                        options={[
                            { value: 'HR Manager', name: 'HR Manager' },
                            { value: 'HR Associate', name: 'HR Associate' },
                        ]}
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
