/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { applyUser, fetchUserProfile } from "../services/userServices";
import { Briefcase, CheckCircle2, FileTextIcon } from "lucide-react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

export default function Apply({ job, onClose = () => { } }) {

    const navigate = useNavigate();

    const [agreeTermsAndCondition, setAgreeTermsAndCondition] = useState(false);
    const [showApplyNotification, setShowApplyNotification] = useState(false);
    const [errors, setErrors] = useState({});

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: null,
        validId: null,
    });

    // ✅ VALIDATION
    const validate = () => {
        const newErrors = {};

        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.sex) newErrors.sex = "Sex is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";

        if (!formData.resume) newErrors.resume = "Resume is required";
        if (!formData.validId) newErrors.validId = "Valid ID is required";

        if (!agreeTermsAndCondition) newErrors.terms = "You must agree before submitting";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const { success, message } = await applyUser(job.id, formData);

            if (success) {
                setShowApplyNotification(true);
                return;
            }

            if (message === 'Unauthorized') return navigate('/register');

            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { success, user } = await fetchUserProfile();
                if (success) setFormData(user);
            } catch (error) {
                console.error(error);
            }
        };
        loadProfile();
    }, []);

    return (
        <>
            <ModalBackground>
                <Modal maxWidth={650}>
                    <div className="mb-4">
                        <ModalHeader
                            icon={Briefcase}
                            title="Apply for Position"
                            subTitle={`${job?.jobTitle} at ${job?.company?.companyName}`}
                            onClose={onClose}
                        />
                    </div>

                    {/* NAME */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Input
                                label="First Name"
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                        </div>

                        <div>
                            <Input
                                label="Last Name"
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                        </div>
                    </div>

                    {/* SEX */}
                    <div className="mb-4">
                        <p className="input-label mb-1">
                            Sex<span className="text-red-500">*</span>
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
                        {errors.sex && <ErrorMessage>{errors.sex}</ErrorMessage>}
                    </div>

                    {/* PHONE */}
                    <div className="mb-4">
                        <Input
                            label="Phone Number"
                            required
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                        />
                        {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                    </div>

                    {/* OPTIONAL */}
                    <div className="mb-4">
                        <Input
                            label="LinkedIn (Optional)"
                            name="linkedIn"
                            value={formData.linkedIn || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Portfolio (Optional)"
                            name="portfolio"
                            value={formData.portfolio || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* FILES */}
                    <div className="mb-4">
                        <Input
                            label="Resume (PDF)"
                            required
                            type="file"
                            name="resume"
                            accept=".pdf"
                            onChange={handleInputChange}
                        />
                        {errors.resume && <ErrorMessage>{errors.resume}</ErrorMessage>}

                        {formData.resume && (
                            <p className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl">
                                <FileTextIcon />
                                {typeof formData.resume === 'string'
                                    ? formData.resume
                                    : formData.resume.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Valid ID (PDF)"
                            required
                            type="file"
                            name="validId"
                            accept=".pdf"
                            onChange={handleInputChange}
                        />
                        {errors.validId && <ErrorMessage>{errors.validId}</ErrorMessage>}

                        {formData.validId && (
                            <p className="mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-3 rounded-xl">
                                <FileTextIcon />
                                {typeof formData.validId === 'string'
                                    ? formData.validId
                                    : formData.validId.name}
                            </p>
                        )}
                    </div>

                    {/* TERMS */}
                    <div className="mb-4">
                        <div className="flex gap-2 bg-gray-100 p-4 rounded-lg">
                            <input
                                type="checkbox"
                                checked={agreeTermsAndCondition}
                                onChange={(e) => setAgreeTermsAndCondition(e.target.checked)}
                            />
                            <p className="text-xs text-gray-500">
                                You agree to Terms & Privacy Policy.
                            </p>
                        </div>
                        {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}
                    </div>

                    <ModalFooter
                        submitLabel="Submit Application"
                        onClose={onClose}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            </ModalBackground>

            {/* SUCCESS MODAL */}
            {showApplyNotification && (
                <ModalBackground>
                    <Modal>
                        <div className="text-center py-6 px-2">
                            <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center animate-in zoom-in duration-300">
                                <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={2} />
                            </div>

                            <p className="text-xl font-semibold mb-2">
                                Application Submitted
                            </p>

                            <p className="text-sm text-gray-500 mb-1 max-w-xs mx-auto">
                                Your application for
                            </p>
                            <p className="text-sm font-medium mb-6 max-w-xs mx-auto">
                                {job?.jobTitle}
                            </p>

                            <p className="text-xs text-gray-400 mb-6">
                                You can track its status anytime from your dashboard.
                            </p>

                            <div className="flex flex-col-reverse sm:flex-row justify-center gap-2">
                                <button
                                    className="btn"
                                    onClick={() => {
                                        setShowApplyNotification(false);
                                        onClose();
                                    }}
                                >
                                    Close
                                </button>

                                <button
                                    className="btn bg-emerald-500 hover:bg-emerald-600 transition-colors text-white"
                                    onClick={() => {
                                        setShowApplyNotification(false);
                                        onClose();
                                        navigate('/dashboard');
                                    }}
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}