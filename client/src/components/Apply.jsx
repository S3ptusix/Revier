/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { applyUser, fetchUserProfile } from "../services/userServices";
import { Briefcase, FileTextIcon } from "lucide-react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import { useState } from "react";

export default function Apply({ job, onClose = () => { } }) {

    const navigate = useNavigate();

    const [agreeTermsAndCondition, setAgreeTermsAndCondition] = useState(false);

    const [showApplyNotification, setShowApplyNotification] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: {},
        validId: {},
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await applyUser(job.id, formData);
            if (success) {
                // onClose();
                // toast.success(message);
                setShowApplyNotification(true);
                return;
            };
            if (message === 'Unauthorized') return navigate('/register');
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { success, message, user } = await fetchUserProfile();

                if (success) return setFormData(user);
                console.error(message);
            } catch (error) {
                console.error('Error on loadProfile:', error);
            }
        }
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

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            label="First Name"
                            required={true}
                            type="text"
                            name="firstName"
                            placeholder="John"
                            value={formData?.firstName}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Last Name"
                            required={true}
                            type="text"
                            name="lastName"
                            placeholder="Doe"
                            value={formData?.lastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <p className="input-label mb-1">Sex<span className="text-red-500">*</span></p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                className={`btn rounded-xl bg-blue-500 text-white ${formData.sex === 'Male' ? '' : 'opacity-50 brightness-75'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                            >
                                <p>Male</p>
                            </button>
                            <button
                                className={`btn rounded-xl bg-pink-500 text-white ${formData.sex === 'Female' ? '' : 'opacity-50 brightness-75'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                            >
                                <p>Female</p>
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Phone Number"
                            required={true}
                            name="phone"
                            value={formData?.phone || ''}
                            placeholder="+63 91 234 5678"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="LinkedIn Profile (Optional)"
                            type="text"
                            name="linkedIn"
                            placeholder="https://linkedin.com/in/johndoe"
                            value={formData.linkedIn || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Portfolio Website (Optional)"
                            type="text"
                            name="portfolio"
                            placeholder="https://johndoe.com"
                            value={formData.portfolio || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Resume"
                            required={true}
                            type="file"
                            name="resume"
                            accept=".pdf"
                            onChange={handleInputChange}
                        />
                        {formData.resume && (
                            <p className='mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-4 rounded-xl'>
                                <FileTextIcon />
                                {typeof formData?.resume === 'string' ? formData.resume : formData.resume.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Valid ID (Driver's License, Passport, etc.)"
                            required={true}
                            type="file"
                            name="validId"
                            accept=".pdf"
                            onChange={handleInputChange}
                        />
                        {formData.validId && (
                            <p className='mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-4 rounded-xl'>
                                <FileTextIcon />
                                {typeof formData?.validId === 'string' ? formData.validId : formData.validId.name}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 bg-gray-100 p-4 rounded-lg mb-4">
                        <input
                            type="checkbox"
                            checked={agreeTermsAndCondition}
                            className="checkbox checkbox-primary checkbox-sm"
                            onChange={(e) => setAgreeTermsAndCondition(e.target.checked)}
                        />
                        <p className="text-xs text-gray-500">By submitting this application, you agree to our Terms of Service and Privacy Policy. Your information will be shared with Techflow Inc for recruitment purposes.</p>
                    </div>

                    <ModalFooter
                        submitLabel={'Submit Application'}
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        disableSubmit={!agreeTermsAndCondition}
                    />

                </Modal>
            </ModalBackground>
            {showApplyNotification && (
                <ModalBackground>
                    <Modal>
                        <div className="text-center py-4">
                            <div className="text-4xl mb-2">🎉</div>

                            <p className="text-lg font-semibold mb-1">
                                Application Submitted!
                            </p>

                            <p className="text-sm text-gray-500 mb-4">
                                Your application for <span className="font-medium">{job?.jobTitle}</span> at{" "}
                                <span className="font-medium">{job?.company?.companyName}</span> has been successfully submitted.
                            </p>

                            <p className="text-xs text-gray-400 mb-6">
                                You can track the status of your application in your dashboard.
                            </p>

                            <div className="flex justify-center gap-2">
                                <button
                                    className="btn bg-emerald-500 text-white px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        setShowApplyNotification(false);
                                        onClose();
                                        navigate('/dashboard');
                                    }}
                                >
                                    Go to Dashboard
                                </button>

                                <button
                                    className="btn bg-gray-100 px-4 py-2 rounded-lg"
                                    onClick={() => {
                                        setShowApplyNotification(false);
                                        onClose();
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}