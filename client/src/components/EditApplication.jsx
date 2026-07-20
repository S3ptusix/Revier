/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { FileTextIcon, Pen, AlertTriangle } from "lucide-react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import ErrorMessage from "./ui/ErrorMessage";
import { useEffect, useState, useRef } from "react";
import { applicantDetails } from "../services/applicantsServices";
import { editApplication } from "../services/userServices";

export default function EditApplication({ applicantId, onClose = () => { } }) {

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

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmiting, setisSubmiting] = useState(false);

    const firstErrorRef = useRef(null);


    const handleSubmit = async () => {
        try {
            setisSubmiting(true)
            const { success, message } = await editApplication(applicantId, formData);

            if (success) {
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setisSubmiting(false);
            setShowConfirm(false);
        }
    };

    useEffect(() => {
        const loadApplicantDetails = async () => {
            try {
                const { success, applicant } = await applicantDetails(applicantId);

                if (success) {
                    setFormData({
                        firstName: applicant.firstName,
                        lastName: applicant.lastName,
                        sex: applicant.sex,
                        phone: applicant.phone,
                        linkedIn: applicant.linkedIn || '',
                        portfolio: applicant.portfolio || '',
                        resume: applicant.resume,
                        validId: applicant.validId,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadApplicantDetails();
    }, []);

    return (
        <>
            {/* MAIN MODAL */}
            <ModalBackground>
                <Modal maxWidth={650}>
                    <div className="mb-6">
                        <ModalHeader
                            icon={Pen}
                            title="Edit Application"
                            subTitle="Update applicant details"
                            onClose={onClose}
                        />
                    </div>

                    {/* NAME */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div ref={!formData.firstName ? firstErrorRef : null}>
                            <Input
                                label="First Name"
                                required
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div>
                            <Input
                                label="Last Name"
                                required
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
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
                                className={`btn rounded-xl ${formData.sex === 'Male'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-500'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                className={`btn rounded-xl ${formData.sex === 'Female'
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-100 text-gray-500'}`}
                                onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    {/* PHONE */}
                    <div className="mb-4">
                        <Input
                            label="Phone Number"
                            required
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* OPTIONAL */}
                    <div className="mb-4">
                        <Input
                            label="LinkedIn (Optional)"
                            name="linkedIn"
                            value={formData.linkedIn}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Portfolio (Optional)"
                            name="portfolio"
                            value={formData.portfolio}
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
                                Uploaded Resume
                            </a>
                        ) : null}
                    </div>

                    <div className="mb-6">
                        <Input
                            label="Valid ID (PDF)"
                            required
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
                                Uploaded Valid ID
                            </a>
                        ) : null}
                    </div>

                    <ModalFooter
                        submitLabel="Save Changes"
                        onClose={onClose}
                        onSubmit={() => setShowConfirm(true)}
                    />
                </Modal>
            </ModalBackground>

            {/* CONFIRM MODAL */}
            {showConfirm && (
                <ModalBackground>
                    <Modal maxWidth={420}>
                        <div className="space-y-6 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <AlertTriangle className="text-amber-600" size={32} />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Confirm Changes
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    This update will affect applicant evaluation.
                                </p>
                            </div>

                            <ModalFooter
                                submitLabel={isSubmiting ? "Saving..." : "Confirm & Save"}
                                onClose={() => setShowConfirm(false)}
                                onSubmit={() => handleSubmit()}
                            />
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}