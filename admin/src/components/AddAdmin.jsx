import { useState } from "react";
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
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                            disableSubmit={isSubmitting}
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