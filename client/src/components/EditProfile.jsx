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

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await editUserProfile(formData);

            if (success) {
                toast.success(message);
                onClose();
            } else {
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
                            </div>

                            <div>
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    required={true}
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
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
                            </div>

                            <div>
                                <Input
                                    label="LinkedIn"
                                    name="linkedIn"
                                    value={formData.linkedIn || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Portfolio"
                                    name="portfolio"
                                    value={formData.portfolio || ''}
                                    onChange={handleInputChange}
                                />
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
                                {formData?.resume?.name ? (
                                    <p className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl">
                                        <FileTextIcon />
                                        {formData.resume.name}
                                    </p>
                                ) : formData?.resume ? (
                                    <a
                                        href={formData.resume}
                                        target="_blank"
                                        className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl"
                                    >
                                        <FileTextIcon size={16} />
                                        Profile Resume
                                    </a>
                                ) : null}
                            </div>

                            <div>
                                <Input
                                    label="Valid ID"
                                    type="file"
                                    name="validId"
                                    accept=".pdf"
                                    onChange={handleInputChange}
                                />
                                {formData?.validId?.name ? (
                                    <p className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl">
                                        <FileTextIcon />
                                        {formData.validId.name}
                                    </p>
                                ) : formData?.validId ? (
                                    <a
                                        href={formData.validId}
                                        target="_blank"
                                        className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl"
                                    >
                                        <FileTextIcon size={16} />
                                        Profile Valid ID
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <ModalFooter
                        submitLabel="Save Changes"
                        onSubmit={() => setShowConfirm(true)}
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
                        </div>

                        <ModalFooter
                            onSubmit={handleSubmit}
                            onClose={() => setShowConfirm(false)}
                            disableSubmit={isSubmitting}
                            submitLabel={isSubmitting ? "Saving..." : "Confirm & Save"}
                        />
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}