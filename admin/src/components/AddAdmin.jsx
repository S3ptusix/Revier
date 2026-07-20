import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { handleRegister } from "../services/adminServices";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import InputCheck from "./ui/Checkbox";
import VerifyEmail from "./VerifyEmail";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";

export default function AddAdmin({
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [errorMessage, setErrorMessage] = useState('');
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const errorRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        sex: 'Male',
        email: '',
        role: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setErrorMessage(""); // clear error on change
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // scroll to error when it appears
    useEffect(() => {
        if (errorMessage && errorRef.current) {
            errorRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [errorMessage]);

    const validate = () => {
        if (!formData.firstName) return "First name is required";
        if (!formData.lastName) return "Last name is required";
        if (!formData.email) return "Email is required";
        if (!formData.role) return "Please select a role";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();

        if (validationError) {
            setErrorMessage(validationError);
            toast.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message } = await handleRegister(formData);

            if (success) {
                loadAfter();
                setOpenVerifyEmail(true);
                toast.success(message, { toastId: 'success-submit' });
                return;
            }

            setErrorMessage(message);
            toast.error(message);

        } catch (error) {
            console.error('Error on handleSubmit:', error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={600}>
                    <div className="space-y-6">

                        <ModalHeader
                            title="Add New Administrator"
                            subTitle="Create a new admin account with specific role"
                            onClose={onClose}
                        />

                        {/* ERROR (TOP + VISIBLE) */}
                        {errorMessage && (
                            <div ref={errorRef}>
                                <ErrorMessage>
                                    <span>{errorMessage}</span>
                                </ErrorMessage>
                            </div>
                        )}

                        {/* FORM */}
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

                        {/* SEX */}
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
                                    className={`btn rounded-xl ${formData.sex === 'Female' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-500'}`}
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

                        {/* ROLE */}
                        <div>
                            <p className="input-label mb-2">
                                Role <span className="text-red-500">*</span>
                            </p>
                            <div className="grid grid-cols-2 gap-2">
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
                        </div>

                        {/* FOOTER */}
                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={isSubmitting ? "Adding..." : "Add Admin"}
                            onClose={onClose}
                            onSubmit={handleSubmit}
                        />
                    </div>
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