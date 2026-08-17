/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { editAdmin, fetchOneAdmin } from "../services/adminServices";
import { toast } from "react-toastify";
import InputCheck from "./ui/Checkbox";
import { fetchAllSelectCompany } from "../services/companyServices";

import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody,
    InfoList

} from "./ui/ui-modal";

export default function EditAdmin({ adminId, onClose = () => { }, loadAfter = () => { } }) {

    const [formData, setFormData] = useState({
        role: '',
        holdCompanies: []
    });

    const [showConfirm, setShowConfirm] = useState(false);

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [companySearch, setCompanySearch] = useState('');

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
            setEditing(true);
            const { success, message } = await editAdmin(adminId, formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            toast.error(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error);
        } finally {
            setEditing(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            const { success, message, admin } = await fetchOneAdmin(adminId);
            if (success) {
                return setFormData({
                    role: admin.role,
                    holdCompanies: admin.holdCompanies || [],
                });
            }
            toast.error(message);
        };

        loadData();

        const load = async () => {
            try {
                setLoading(true);

                const { success, message, companies } = await fetchAllSelectCompany();
                if (success) setCompanies(companies);
                else toast.error(message);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredCompanies = companies.filter((c) =>
        c.companyName?.toLowerCase().includes(companySearch.toLowerCase())
    );

    return (
        <>
            {/* 🔹 Main Modal */}
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Edit Administrator"
                        subTitle="Update this administrator's role and company access."
                        onClose={onClose}
                    />

                    <ModalBody>
                        {/* Role selection */}
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

                        {/* Company assignment — only relevant for HR Associate */}
                        {formData.role === 'HR Associate' && (
                            <div className="mt-5 border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-700">
                                        Assigned companies
                                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                                            ({formData.holdCompanies.length} selected)
                                        </span>
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Select all
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            type="button"
                                            onClick={handleClearAll}
                                            className="text-gray-500 hover:underline"
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
                                        className="mb-2 w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-blue-400"
                                    />
                                )}

                                <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-50">
                                    {loading ? (
                                        <p className="px-3 py-4 text-sm text-gray-400 text-center">
                                            Loading companies...
                                        </p>
                                    ) : filteredCompanies.length === 0 ? (
                                        <p className="px-3 py-4 text-sm text-gray-400 text-center">
                                            {companySearch ? "No companies match your search." : "No companies available."}
                                        </p>
                                    ) : (
                                        filteredCompanies.map((company) => (
                                            <label
                                                key={company.id}
                                                className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-50"
                                            >
                                                <InputCheck
                                                    type="checkbox"
                                                    name="holdCompanies"
                                                    checked={formData.holdCompanies.includes(company.id)}
                                                    onChange={() => handleCompanyToggle(company.id)}
                                                />
                                                <span className="text-gray-800">{company.companyName}</span>
                                            </label>
                                        ))
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
                        submitLabel="Save Changes"
                        onSubmit={() => setShowConfirm(true)}
                        onClose={onClose}
                    />
                </Modal>
            </ModalBackground>

            {/* 🔹 Confirm Modal */}
            {showConfirm && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Update Administrator Role"
                            subTitle="Are you sure you want to save these changes?"
                        />

                        <ModalBody>
                            <InfoList
                                infoList={[
                                    "Change the administrator’s access level.",
                                    "Modify what features they can view or manage.",
                                    "Affect permissions across the system.",
                                ]}
                            />
                        </ModalBody>


                        <ModalFooter
                            submitLabel={editing ? "Saving..." : "Confirm Changes"}
                            onSubmit={handleSubmit}
                            onClose={onClose}
                            disableSubmit={editing}
                        />
                    </Modal>

                </ModalBackground>


            )}
        </>
    );


}