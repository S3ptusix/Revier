/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from "react-toastify";
import { useForm } from "../hooks/form";
import { applyUser, fetchUserProfile } from "../services/userServices";
import {
    Briefcase,
    CheckCircle2,
    FileTextIcon,
    IdCard,
    User,
    Phone,
    ShieldCheck,
    X,
    Eye,
    UploadCloud
} from "lucide-react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";

const PRIVACY_POLICY_EFFECTIVE_DATE = "May 2026";

const PRIVACY_POLICY_SECTIONS = [
    {
        title: "1. Information We Collect",
        intro: "We may collect personal information including, but not limited to:",
        items: [
            "Full name",
            "Contact number",
            "Email address",
            "Resume or Curriculum Vitae",
            "Government-issued identification details when required",
            "Character references",
            "Certificates, licenses, and training records",
            "Interview notes and assessment results"
        ]
    },
    {
        title: "2. Purpose of Collection",
        intro: "Your personal information may be used to:",
        items: [
            "Process employment applications",
            "Verify qualifications and credentials",
            "Schedule interviews and assessments",
            "Match applicants with suitable job opportunities",
            "Conduct background or reference checks where appropriate",
            "Communicate recruitment updates",
            "Maintain applicant records",
            "Comply with legal and regulatory requirements"
        ]
    },
    {
        title: "3. Sharing of Information",
        intro: "Personal information may be shared only with:",
        items: [
            "Authorized employees of Revier Consultants & Staffing Resources Inc.",
            "Client companies evaluating applicants for employment",
            "Service providers assisting with recruitment operations under appropriate confidentiality obligations",
            "Government agencies when required by law"
        ],
        outro: "We do not sell or rent your personal information to third parties."
    },
    {
        title: "4. Data Retention",
        paragraph: "Applicant information will be retained only for as long as necessary to fulfill recruitment purposes, comply with legal obligations, resolve disputes, or maintain legitimate business records. Information that is no longer required will be securely deleted or anonymized."
    },
    {
        title: "5. Data Security",
        paragraph: "We implement reasonable administrative, physical, and technical safeguards to protect personal information against unauthorized access, loss, misuse, alteration, or disclosure. Access to applicant information is limited to authorized personnel who require it for legitimate business purposes."
    },
    {
        title: "6. Your Rights",
        intro: "Under the Data Privacy Act of 2012, you have the right to:",
        items: [
            "Be informed about the processing of your personal data",
            "Access your personal information",
            "Correct inaccurate or incomplete information",
            "Object to certain processing activities where permitted by law",
            "Request the deletion or blocking of personal data when appropriate",
            "Withdraw consent where processing is based on consent, subject to legal and contractual limitations",
            "File a complaint with the National Privacy Commission if you believe your rights have been violated"
        ]
    },
    {
        title: "7. Cookies and Website Usage",
        paragraph: "If you visit our website or online services, we may collect technical information such as browser type, IP address, device information, and website usage data through cookies or similar technologies to improve our services and maintain system security."
    },
    {
        title: "8. Changes to this Privacy Policy",
        paragraph: "This Privacy Policy may be updated from time to time. Any revisions will take effect upon publication on our official platforms."
    },
    {
        title: "9. Contact Information",
        intro: "For questions, requests, or concerns regarding this Privacy Policy or the processing of your personal information, you may contact:",
        contact: [
            "Revier Consultants & Staffing Resources Inc.",
            "Email: revierconsultants@yahoo.com",
            "Telephone: 0921 444 9014",
            "Office Address: 3rd Floor, S-Drive Center Building, General Malvar St., Brgy. Tubigan, Biñan, Philippines"
        ]
    }
];

function PrivacyPolicyModal({ onClose }) {
    return (
        <ModalBackground>
            <Modal maxWidth={680}>
                <div className="mb-2">
                    <ModalHeader
                        icon={ShieldCheck}
                        title="Privacy Policy"
                        subTitle={`Effective ${PRIVACY_POLICY_EFFECTIVE_DATE}`}
                        onClose={onClose}
                    />
                </div>

                <div className="max-h-[60vh] overflow-y-auto pr-2 -mr-2 space-y-5 text-sm text-gray-600 leading-relaxed">
                    <p>
                        Revier Consultants & Staffing Resources Inc. values the privacy of every
                        applicant, employee, client, and website visitor. We are committed to
                        protecting personal information in accordance with the Data Privacy Act
                        of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.
                    </p>

                    {PRIVACY_POLICY_SECTIONS.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-gray-900 font-semibold mb-1.5">{section.title}</h4>

                            {section.paragraph && <p>{section.paragraph}</p>}

                            {section.intro && <p className="mb-1.5">{section.intro}</p>}

                            {section.items && (
                                <ul className="list-disc pl-5 space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}

                            {section.outro && <p className="mt-1.5">{section.outro}</p>}

                            {section.contact && (
                                <p className="space-y-0.5">
                                    {section.contact.map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                    <button className="btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </Modal>
        </ModalBackground>
    );
}

export default function Apply({ job, onClose = () => { } }) {

    const navigate = useNavigate();

    const [showApplyNotification, setShowApplyNotification] = useState(false);
    const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
    const [isAgree, setIsAgree] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

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

    const isFormValid = formData.firstName?.trim()
        && formData.lastName?.trim()
        && formData.sex
        && formData.phone?.trim()
        && formData.resume
        && formData.validId;

    const handleSubmit = async () => {

        try {
            setIsLoading(true);
            const { success, message } = await applyUser(job.id, formData);

            if (success) {
                setShowApplyNotification(true);
                return;
            }

            if (message === 'Unauthorized') return navigate('/register');

            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const clearFile = (field) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(p => ({ ...p, [field]: null }));
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setIsProfileLoading(true);
                const { success, user } = await fetchUserProfile();
                if (success) setFormData(user);
            } catch (error) {
                console.error(error);
            } finally {
                setIsProfileLoading(false);
            }
        };
        loadProfile();
    }, []);

    const renderFileField = ({ name, label, icon: Icon, required }) => {
        const value = formData?.[name];
        const hasNewFile = value?.name;
        const hasExistingFile = !hasNewFile && value;

        return (
            <div>
                <p className="input-label mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </p>

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
                            {hasNewFile ? value.name : `Profile ${label.replace(" (PDF)", "")}`}
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
                        <button
                            type="button"
                            onClick={clearFile(name)}
                            className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                            title="Remove"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

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
                <Modal maxWidth={650}>
                    <div className="mb-6">
                        <ModalHeader
                            icon={Briefcase}
                            title="Apply for Position"
                            subTitle={`${job?.jobTitle} at ${job?.company?.companyName}`}
                            onClose={onClose}
                        />
                    </div>

                    {isProfileLoading ? (
                        <div className="space-y-6 mb-6 animate-pulse">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="h-11 bg-gray-100 rounded-xl" />
                                <div className="h-11 bg-gray-100 rounded-xl" />
                            </div>
                            <div className="h-11 bg-gray-100 rounded-xl w-1/2" />
                            <div className="h-11 bg-gray-100 rounded-xl" />
                        </div>
                    ) : (
                        <div className="space-y-7 mb-6">

                            {/* PERSONAL INFO */}
                            <section>
                                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                    <User size={14} /> Personal Information
                                </h3>

                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            required
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                        <Input
                                            label="Last Name"
                                            required
                                            name="lastName"
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
                                                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => setFormData(prev => ({ ...prev, sex: option }))}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* CONTACT */}
                            <section>
                                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                    <Phone size={14} /> Contact & Links
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Phone Number"
                                        required
                                        name="phone"
                                        value={formData.phone || ''}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="LinkedIn (Optional)"
                                        name="linkedIn"
                                        placeholder="linkedin.com/in/username"
                                        value={formData.linkedIn || ''}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Portfolio (Optional)"
                                        name="portfolio"
                                        placeholder="yourportfolio.com"
                                        value={formData.portfolio || ''}
                                        onChange={handleInputChange}
                                        className="md:col-span-2"
                                    />
                                </div>
                            </section>

                            {/* FILES */}
                            <section>
                                <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                                    <FileTextIcon size={14} /> Documents
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {renderFileField({ name: "resume", label: "Resume (PDF)", icon: FileTextIcon, required: true })}
                                    {renderFileField({ name: "validId", label: "Valid ID (PDF)", icon: IdCard, required: true })}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* TERMS */}
                    <div className="mb-4">
                        <label className="flex items-start gap-2.5 bg-gray-50 border border-gray-200 p-3.5 rounded-xl cursor-pointer">
                            <input
                                type="checkbox"
                                className="mt-0.5"
                                checked={isAgree}
                                onChange={(e) => setIsAgree(e.target.checked)}
                            />
                            <span className="text-xs text-gray-500 leading-relaxed">
                                You agree to our{" "}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPrivacyPolicy(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
                                >
                                    Privacy Policy
                                </button>{" "}
                                and the use of your information for this application.
                            </span>
                        </label>
                    </div>

                    <ModalFooter
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        disableSubmit={!isAgree || isLoading || isProfileLoading || !isFormValid}
                        submitLabel={isLoading ? 'Submitting...' : 'Submit'}
                    />
                </Modal>
            </ModalBackground>

            {/* PRIVACY POLICY MODAL */}
            {showPrivacyPolicy && (
                <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
            )}

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