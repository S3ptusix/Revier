/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";
import Input from "./ui/Input";
import { editUserProfile, fetchUserProfile } from "../services/userServices";
import { useForm } from "../hooks/form";
import { toast } from "react-toastify";
import { FileTextIcon, IdCard, AlertTriangle } from "lucide-react";

export default function EditProfile({ onClose }) {
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        email: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: {},
        validId: {}
    });

    // ✅ VALIDATION
    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!formData.sex) newErrors.sex = "Sex is required";

        if (formData.phone && !/^09\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Phone must be a valid PH number (09XXXXXXXXX)";
        }

        if (formData.linkedIn && !formData.linkedIn.includes("linkedin.com")) {
            newErrors.linkedIn = "Enter a valid LinkedIn URL";
        }

        if (formData.portfolio && !/^https?:\/\//.test(formData.portfolio)) {
            newErrors.portfolio = "Portfolio must be a valid URL (http/https)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message, errors: backendErrors } = await editUserProfile(formData);

            if (success) {
                toast.success(message);
                onClose();
            } else {
                if (backendErrors) {
                    setErrors(backendErrors); // 👈 backend field errors
                }
                toast.error(message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        } finally {
            setIsSubmitting(false);
            setShowConfirm(false);
        }
    };

    const handleOpenConfirm = () => {
        if (!validateForm()) return;
        setShowConfirm(true);
    };

    useEffect(() => {
        const loadProfile = async () => {
            const { success, user } = await fetchUserProfile();
            if (success) setFormData(user);
        };
        loadProfile();
    }, []);

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={700}>
                    <div className="mb-8">
                        <ModalHeader title="Edit Profile" onClose={onClose} />
                    </div>

                    {/* ✅ ERROR SUMMARY */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                            Please fix the highlighted fields below.
                        </div>
                    )}

                    <div className="space-y-4 mb-8">

                        {/* NAME */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    required={true}
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                            </div>

                            <div>
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    required={true}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                            </div>
                        </div>

                        {/* SEX */}
                        <div>
                            <p className="input-label mb-1">
                                Sex <span className="text-red-500">*</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    className={`btn rounded-xl ${formData.sex === 'Male' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={() => setFormData(p => ({ ...p, sex: 'Male' }))}
                                >
                                    Male
                                </button>
                                <button
                                    className={`btn rounded-xl ${formData.sex === 'Female' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                                    onClick={() => setFormData(p => ({ ...p, sex: 'Female' }))}
                                >
                                    Female
                                </button>
                            </div>
                            {errors.sex && <p className="text-red-500 text-xs">{errors.sex}</p>}
                        </div>

                        {/* CONTACT */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Email" value={formData.email} disabled />

                            <div>
                                <Input
                                    label="Phone"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                            </div>

                            <div>
                                <Input
                                    label="LinkedIn"
                                    name="linkedIn"
                                    value={formData.linkedIn || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.linkedIn && <p className="text-red-500 text-xs">{errors.linkedIn}</p>}
                            </div>

                            <div>
                                <Input
                                    label="Portfolio"
                                    name="portfolio"
                                    value={formData.portfolio || ''}
                                    onChange={handleInputChange}
                                />
                                {errors.portfolio && <p className="text-red-500 text-xs">{errors.portfolio}</p>}
                            </div>
                        </div>

                        {/* FILES */}
                        <div className="grid md:grid-cols-2 gap-4">

                            <div>
                                <Input
                                    label="Resume"
                                    type="file"
                                    name="resume"
                                    accept=".pdf"
                                    onChange={handleInputChange}
                                />
                                {formData.resume && (
                                    <a
                                        href={`${API_URL}/uploads/resumes/${formData.resume}`}
                                        target="_blank"
                                        className="mt-2 flex items-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-lg"
                                    >
                                        <FileTextIcon size={16} />
                                        {typeof formData.resume === 'string'
                                            ? formData.resume
                                            : formData.resume.name}
                                    </a>
                                )}
                            </div>

                            <div>
                                <Input
                                    label="Valid ID"
                                    type="file"
                                    name="validId"
                                    accept=".pdf"
                                    onChange={handleInputChange}
                                />
                                {formData.validId && (
                                    <a
                                        href={`${API_URL}/uploads/validIds/${formData.validId}`}
                                        target="_blank"
                                        className="mt-2 flex items-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-lg"
                                    >
                                        <IdCard size={16} />
                                        {typeof formData.validId === 'string'
                                            ? formData.validId
                                            : formData.validId.name}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <ModalFooter
                        submitLabel="Save Changes"
                        onSubmit={handleOpenConfirm}
                        onClose={onClose}
                    />
                </Modal>
            </ModalBackground>

            {/* CONFIRM MODAL */}
            {showConfirm && (
                <ModalBackground>
                    <Modal maxWidth={500}>
                        <ModalHeader
                            title="Confirm Changes"
                            onClose={() => setShowConfirm(false)}
                        />

                        <div className="p-4 space-y-4 text-sm">
                            <div className="flex gap-2 text-yellow-600">
                                <AlertTriangle />
                                <p className="font-medium">
                                    Please review before saving
                                </p>
                            </div>

                            <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                <li>Your profile will be updated immediately.</li>
                                <li>Uploaded files will replace old ones.</li>
                                <li>This may affect job applications.</li>
                            </ul>

                            {/* ✅ SHOW ERRORS IF SOMEHOW STILL EXIST */}
                            {Object.keys(errors).length > 0 && (
                                <div className="text-red-500 text-xs">
                                    Fix errors before confirming.
                                </div>
                            )}
                        </div>

                        <ModalFooter
                            submitLabel={isSubmitting ? "Saving..." : "Confirm & Save"}
                            onSubmit={handleSubmit}
                            onClose={() => setShowConfirm(false)}
                        />
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}