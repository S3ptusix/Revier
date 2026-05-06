/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { FileTextIcon, Pen } from "lucide-react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import { useEffect } from "react";
import { applicantDetails } from "../services/applicantsServices";
import { editApplication } from "../services/userServices";

export default function EditApplication({
    applicantId,
    onClose = () => { }
}) {

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
            const { success, message } = await editApplication(applicantId, formData);
            if (success) {
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const loadApplicantDetails = async () => {
            try {
                const { success, message, applicant } = await applicantDetails(applicantId);

                if (success) return setFormData({
                    firstName: applicant.firstName,
                    lastName: applicant.lastName,
                    sex: applicant.sex,
                    phone: applicant.phone,
                    linkedIn: applicant.linkedIn || '',
                    portfolio: applicant.portfolio || '',
                    resume: applicant.resume,
                    validId: applicant.validId,
                });
                console.error(message);
            } catch (error) {
                console.error('Error on loadApplicantDetails:', error);
            }
        }
        loadApplicantDetails();

    }, []);

    return (
        <ModalBackground>
            <Modal maxWidth={650}>
                <div className="mb-4">
                    <ModalHeader
                        icon={Pen}
                        title="Edit Application"
                        subTitle={`${formData?.job?.jobTitle} at ${formData?.job?.company?.companyName}`}
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
                        value={formData?.phone}
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
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-4">
                    <Input
                        label="Portfolio Website (Optional)"
                        type="text"
                        name="portfolio"
                        placeholder="https://johndoe.com"
                        value={formData.portfolio}
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
                <ModalFooter
                    submitLabel={'Edit Application'}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </ModalBackground>
    );
}