/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { FileTextIcon, Pen, AlertTriangle } from "lucide-react";
import { Modal, ModalBackground, ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";
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
        birthday: ''
    });

    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false);

    const firstErrorRef = useRef(null);


    const handleSubmit = async () => {
        try {
            setisSubmitting(true)
            const { success, message } = await editApplication(applicantId, formData);

            if (success) {
                onClose();
                return toast.success(message);
            }
            toast.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setisSubmitting(false);
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
                        birthday: applicant.birthday,
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
                <Modal>
                    <ModalHeader
                        title="Edit Application"
                        subTitle="Update applicant details"
                        onClose={onClose}
                    />

                    <ModalBody>

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

                        {/* BIRTHDAY */}
                        <Input
                            label="Birthdate"
                            required
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                        />

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

                    </ModalBody>

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
                    <Modal>
                        <ModalHeader
                            title="Confirm Changes"
                            onClose={() => setShowConfirm(false)}
                        />
                        <ModalBody >
                            <p className="text-sm">
                                This update will affect applicant evaluation.
                            </p>
                        </ModalBody>
                        <ModalFooter
                            submitLabel={isSubmitting ? "Saving..." : "Confirm & Save"}
                            onClose={() => setShowConfirm(false)}
                            onSubmit={() => handleSubmit()}
                        />
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}