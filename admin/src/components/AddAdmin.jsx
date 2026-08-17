import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleRegister } from "../services/adminServices";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";
import VerifyEmail from "./VerifyEmail";
import { fetchAllSelectCompany } from "../services/companyServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "./ui/ui-modal";

export default function AddAdmin({
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const [companySearch, setCompanySearch] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: 'Male',
        email: '',
        role: '',
        holdCompanies: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCompanyToggle = (companyId) => {
        setFormData((prev) => {
            const alreadySelected = prev.holdCompanies.includes(companyId);
            return {
                ...prev,
                holdCompanies: alreadySelected
                    ? prev.holdCompanies.filter((id) => id !== companyId)
                    : [...prev.holdCompanies, companyId],
            };
        });
    };

    const handleSelectAll = () => {
        setFormData((prev) => ({
            ...prev,
            holdCompanies: filteredCompanies.map((c) => c.id),
        }));
    };

    const handleClearAll = () => {
        setFormData((prev) => ({ ...prev, holdCompanies: [] }));
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await handleRegister(formData);

            if (success) {
                loadAfter();
                setOpenVerifyEmail(true);
                toast.success(message, { toastId: 'success-submit' });
                return;
            }

            toast.error(message);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoadingCompanies(true);
                const { success, message, companies } = await fetchAllSelectCompany();
                if (success) setCompanies(companies);
                else toast.error(message);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong.");
            } finally {
                setLoadingCompanies(false);
            }
        };
        load();
    }, []);

    const filteredCompanies = companies.filter((c) =>
        c.companyName?.toLowerCase().includes(companySearch.toLowerCase())
    );

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={600}>

                    <ModalHeader
                        title="Add New Administrator"
                        subTitle="Create a new admin account with specific role"
                        onClose={onClose}
                    />

                    <ModalBody>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                required
                                name="firstName"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Last Name"
                                required
                                name="lastName"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <p className="input-label mb-2">
                                Sex <span className="text-red-500">*</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    className={`btn rounded-xl ${formData.sex === 'Male' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                                >
                                    Male
                                </button>

                                <button
                                    type="button"
                                    className={`btn rounded-xl ${formData.sex === 'Female' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <Input
                            label="Email Address"
                            required
                            type="email"
                            name="email"
                            placeholder="admin@email.com"
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Access level</p>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${formData.role === 'HR Manager'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <InputCheck
                                        type="radio"
                                        name="role"
                                        value="HR Manager"
                                        checked={formData.role === 'HR Manager'}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">HR Manager</p>
                                        <p className="text-xs text-gray-500">Full access, all companies</p>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${formData.role === 'HR Associate'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <InputCheck
                                        type="radio"
                                        name="role"
                                        value="HR Associate"
                                        checked={formData.role === 'HR Associate'}
                                        onChange={handleInputChange}
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">HR Associate</p>
                                        <p className="text-xs text-gray-500">Limited to assigned companies</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {formData.role === 'HR Associate' && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="input-label">
                                        Assigned Companies <span className="text-red-500">*</span>
                                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                                            ({formData.holdCompanies.length} selected)
                                        </span>
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-blue-500 hover:underline"
                                        >
                                            Select all
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            type="button"
                                            onClick={handleClearAll}
                                            className="text-gray-400 hover:underline"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {companies.length > 6 && (
                                    <input
                                        type="text"
                                        placeholder="Search companies..."
                                        value={companySearch}
                                        onChange={(e) => setCompanySearch(e.target.value)}
                                        className="mb-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
                                    />
                                )}

                                <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100 p-2">
                                    {loadingCompanies ? (
                                        <p className="py-4 text-sm text-gray-400 text-center">
                                            Loading companies...
                                        </p>
                                    ) : filteredCompanies.length === 0 ? (
                                        <p className="py-4 text-sm text-gray-400 text-center">
                                            {companySearch ? "No companies match your search." : "No companies available."}
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {filteredCompanies.map((company) => (
                                                <InputCheck
                                                    key={company.id}
                                                    type="checkbox"
                                                    name="holdCompanies"
                                                    label={company.companyName}
                                                    checked={formData.holdCompanies.includes(company.id)}
                                                    onChange={() => handleCompanyToggle(company.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {formData.holdCompanies.length === 0 && (
                                    <p className="mt-2 text-xs text-amber-600">
                                        This admin won't have access to any company until at least one is selected.
                                    </p>
                                )}
                            </div>
                        )}

                    </ModalBody>

                    <ModalFooter
                        cancelLabel="Cancel"
                        submitLabel={isSubmitting ? "Adding..." : "Add Admin"}
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        disableSubmit={isSubmitting}
                    />
                </Modal>
            </ModalBackground>

            {/* VERIFY EMAIL MODAL */}
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={onClose}
                />
            )}
        </>
    );
}