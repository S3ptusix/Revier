/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "./ui/ui-modal";
import Input from "./ui/Input";
import { editUserProfile, fetchUserProfile } from "../services/userServices";
import { useForm } from "../hooks/form";
import { toast } from "react-toastify";
import {
    FileTextIcon,
    IdCard,
    AlertTriangle,
    User,
    Phone,
    Linkedin,
    Globe,
    X,
    Eye,
    UploadCloud
} from "lucide-react";

export default function EditProfile({ onClose }) {

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        email: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: {},
        validId: {},
        birthday: ''
    });

    const isFormValid = formData.firstName?.trim() && formData.lastName?.trim() && formData.sex;

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            console.log(formData)
            const { success, message } = await editUserProfile(formData);

            if (success) {
                toast.success(message || "Profile updated");
                onClose();
            } else {
                toast.error(message || "Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
            setShowConfirm(false);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            const { success, user } = await fetchUserProfile();
            if (success) setFormData(user);
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    // Shared file-field renderer so Resume and Valid ID behave identically
    const renderFileField = ({ name, label, icon: Icon }) => {
        const value = formData?.[name];
        const hasNewFile = value?.name;
        const hasExistingFile = !hasNewFile && value;

        return (
            <div>
                <p className="input-label mb-1">{label}</p>

                {!hasNewFile && !hasExistingFile && (
                    <label
                        htmlFor={name}
                        className="flex flex-col items-center justify-center gap-1.5 text-center border-2 border-dashed border-gray-200 rounded-xl py-5 px-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                    >
                        <UploadCloud size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-500">
                            Click to upload <span className="text-gray-400">(PDF)</span>
                        </span>
                    </label>
                )}

                {(hasNewFile || hasExistingFile) && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Icon size={16} />
                        </div>
                        <span className="flex-1 truncate">
                            {hasNewFile ? value.name : `Current ${label.toLowerCase()}`}
                        </span>
                        {hasExistingFile && (
                            <a
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                                title={`View ${label.toLowerCase()}`}
                            >
                                <Eye size={16} />
                            </a>
                        )}
                    </div>
                )}

                {/* Hidden native input still drives the actual file selection */}
                <input
                    id={name}
                    name={name}
                    type="file"
                    accept=".pdf"
                    onChange={handleInputChange}
                    className={(hasNewFile || hasExistingFile) ? "hidden" : "sr-only"}
                    tabIndex={(hasNewFile || hasExistingFile) ? -1 : 0}
                />
                {(hasNewFile || hasExistingFile) && (
                    <label
                        htmlFor={name}
                        className="inline-block mt-1.5 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium"
                    >
                        Replace file
                    </label>
                )}
            </div>
        );
    };

    return (
        <>
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Edit Profile"
                        onClose={onClose}
                    />
                    <ModalBody>
                        {isLoading ? (
                            <div className="space-y-6 mb-8 animate-pulse">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="h-11 bg-gray-100 rounded-xl" />
                                    <div className="h-11 bg-gray-100 rounded-xl" />
                                </div>
                                <div className="h-11 bg-gray-100 rounded-xl w-1/2" />
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="h-11 bg-gray-100 rounded-xl" />
                                    <div className="h-11 bg-gray-100 rounded-xl" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-7 mb-8">

                                {/* PERSONAL INFO */}
                                <section>
                                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                        <User size={14} /> Personal Information
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <Input
                                                label="First Name"
                                                name="firstName"
                                                required={true}
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                            />
                                            <Input
                                                label="Last Name"
                                                name="lastName"
                                                required={true}
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <p className="input-label mb-1">
                                                Sex <span className="text-red-500">*</span>
                                            </p>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["Male", "Female"].map((option) => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        aria-pressed={formData.sex === option}
                                                        className={`btn rounded-xl border transition-colors ${formData.sex === option
                                                            ? "bg-blue-600 border-blue-600 text-white"
                                                            : "bg-white border-blue-200 text-blue-500 hover:border-blue-300"
                                                            }`}
                                                        onClick={() => setFormData(p => ({ ...p, sex: option }))}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <Input
                                        label="Birthdate"
                                        required
                                        type="date"
                                        name="birthday"
                                        value={formData.birthday}
                                        onChange={handleInputChange}
                                    />
                                </section>

                                {/* CONTACT */}
                                <section>
                                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                        <Phone size={14} /> Contact Details
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            label="Email"
                                            value={formData.email}
                                            disabled
                                        />
                                        <Input
                                            label="Phone"
                                            name="phone"
                                            value={formData.phone || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            label="LinkedIn"
                                            name="linkedIn"
                                            placeholder="linkedin.com/in/username"
                                            value={formData.linkedIn || ''}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            label="Portfolio"
                                            name="portfolio"
                                            placeholder="yourportfolio.com"
                                            value={formData.portfolio || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </section>

                                {/* FILES */}
                                <section>
                                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                        <FileTextIcon size={14} /> Documents
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {renderFileField({ name: "resume", label: "Resume", icon: FileTextIcon })}
                                        {renderFileField({ name: "validId", label: "Valid ID", icon: IdCard })}
                                    </div>
                                </section>
                            </div>
                        )}
                    </ModalBody>

                    <ModalFooter
                        submitLabel="Save Changes"
                        onSubmit={() => setShowConfirm(true)}
                        onClose={onClose}
                        disableSubmit={isLoading || !isFormValid}
                        submitColor="GREEN"
                    />
                </Modal>
            </ModalBackground>

            {/* CONFIRM MODAL */}
            {showConfirm && (
                <ModalBackground>
                    <Modal maxWidth={480}>
                        <ModalHeader
                            title="Confirm Changes"
                            onClose={() => setShowConfirm(false)}
                        />

                        <div className="p-4 space-y-4 text-sm">
                            <div className="flex gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                <p className="font-medium">
                                    Please review before saving
                                </p>
                            </div>

                            <ul className="list-disc pl-5 space-y-1 text-gray-600">
                                <li>Your profile will be updated immediately.</li>
                                <li>Uploaded files will replace old ones.</li>
                                <li>This may affect job applications.</li>
                            </ul>
                        </div>

                        <ModalFooter
                            onClose={() => setShowConfirm(false)}

                            onSubmit={handleSubmit}
                            disableSubmit={isSubmitting}
                            submitLabel={isSubmitting ? "Saving..." : "Confirm & Save"}
                        />
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}