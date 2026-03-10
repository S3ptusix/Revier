/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin, handleRegister } from "../services/adminServices";
import { toast } from "react-toastify";
import { fetchAllCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";

export default function EditAdmin({ adminId, onClose = () => { }, loadTable = () => { } }) {

    const [selectCompanies, setSelectCompanies] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        role: '',
        assignedCompanies: []
    });

    const hideAssignedCompanies = formData.role !== 'HR Manager';

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        const id = parseInt(e.target.value);
        setFormData((prev) => {
            const updated = prev.assignedCompanies.includes(id)
                ? prev.assignedCompanies.filter((c) => c !== id) // remove if already checked
                : [...prev.assignedCompanies, id]; // add if not checked
            return { ...prev, assignedCompanies: updated };
        });
    };

    const handleSubmit = async () => {
        try {
            const { success, message } = await editAdmin(adminId, formData);
            if (success) {
                loadTable();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    useEffect(() => {
        const runFetchAllCompany = async () => {
            const { success, message, companies } = await fetchAllCompany();

            if (success) {
                setSelectCompanies(companies);
            } else {
                console.error(message);
            }
        };
        const loadData = async () => {
            const { success, message, admin } = await fetchOneAdmin(adminId);
            if (success) return setFormData(admin);
            setErrorMessage(message);
        }

        loadData();
        runFetchAllCompany();
    }, []);

    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold mb-8">Edit Administrator</p>

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

                {hideAssignedCompanies &&
                    <div className="grid gap-2 p-4 rounded-lg border border-gray-200 mb-8">
                        {selectCompanies.length > 0 ?
                            selectCompanies.map((company) => (
                                <div key={company.id} className="flex gap-2 text-sm font-semibold">
                                    <input
                                        type="checkbox"
                                        value={company.id}
                                        checked={formData.assignedCompanies.includes(company.id)}
                                        className="checkbox checkbox-sm"
                                        onChange={handleCheckboxChange}
                                    />
                                    <p>{company.companyName}</p>
                                </div>
                            ))
                            : <p className="text-sm text-gray-500">No company found.</p>
                        }
                    </div>
                }

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
