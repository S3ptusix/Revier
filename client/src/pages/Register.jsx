/* eslint-disable no-unused-vars */
import {
    ArrowLeft, ArrowRight, Eye, EyeOff, FileTextIcon, IdCard, UploadCloud, X,
    User, Lock, FileText, Phone, Check
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../services/authServices";
import { useForm } from "../hooks/form";
import { useState, useRef, useEffect } from "react";
import VerifyEmail from "../components/VerifyEmail";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

// Step definitions: each groups related fields so the person only sees
// what's relevant to the current decision, not the whole form at once.
const STEPS = [
    { key: "personal", label: "Personal", icon: User },
    { key: "security", label: "Security", icon: Lock },
    { key: "contact", label: "Contact", icon: Phone, optional: true },
    { key: "documents", label: "Documents", icon: FileText, optional: true },
];

export default function Register() {
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const firstNameRef = useRef(null);
    const emailRef = useRef(null);

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: null,
        validId: null
    });

    // Autofocus the first field whenever a new step mounts
    useEffect(() => {
        firstNameRef.current?.focus();
    }, [step]);

    const clearError = () => errorMessage && setErrorMessage('');

    // ---- Per-step validation -------------------------------------------------
    // Only the fields visible on the current step are checked, so the person
    // never gets blocked by an error on a screen they haven't seen yet.
    const validateStep = (index) => {
        if (index === 0) {
            if (!formData.firstName.trim()) return "First name is required.";
            if (!formData.lastName.trim()) return "Last name is required.";
            if (!formData.sex) return "Please select your sex.";
            if (!formData.email.trim()) return "Email is required.";
            if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format.";
        }
        if (index === 1) {
            if (!formData.password) return "Password is required.";
            if (formData.password.length < 6) return "Password must be at least 6 characters.";
            if (!formData.confirmPassword) return "Please confirm your password.";
            if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
        }
        if (index === 2) {
            if (formData.phone && !/^(09|\+639)\d{9}$/.test(formData.phone.trim())) {
                return "Please enter a valid PH phone number.";
            }
        }
        return null;
    };

    const goNext = () => {
        const error = validateStep(step);
        if (error) return setErrorMessage(error);
        setErrorMessage('');
        setStep(s => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => {
        setErrorMessage('');
        setStep(s => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        // Documents step has no required fields, but re-run everything once
        // in case someone jumped steps or edited a field after going back.
        for (let i = 0; i < STEPS.length; i++) {
            const error = validateStep(i);
            if (error) {
                setStep(i);
                return setErrorMessage(error);
            }
        }

        try {
            setIsLoading(true);
            setErrorMessage('');

            const form = new FormData();
            form.append("firstName", formData.firstName);
            form.append("lastName", formData.lastName);
            form.append("sex", formData.sex);
            form.append("email", formData.email);
            form.append("password", formData.password);
            form.append("confirmPassword", formData.confirmPassword);
            form.append("phone", formData.phone);
            form.append("linkedIn", formData.linkedIn);
            form.append("portfolio", formData.portfolio);

            if (formData.resume) form.append("resume", formData.resume);
            if (formData.validId) form.append("validId", formData.validId);

            const { success, message } = await handleRegister(form);

            if (success) {
                setOpenVerifyEmail(true);
                return;
            }

            setErrorMessage(message || "Registration failed.");
        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const isLastStep = step === STEPS.length - 1;

    const handleKeyDown = (e) => {
        if (e.key !== "Enter") return;
        if (isLastStep) handleSubmit();
        else goNext();
    };

    const clearFile = (field) => (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(p => ({ ...p, [field]: null }));
    };

    const renderFileField = ({ name, label, icon: Icon }) => {
        const value = formData?.[name];
        const hasFile = value?.name;

        return (
            <div>
                <p className="input-label mb-1">{label} <span className="text-gray-400 font-normal">(Optional)</span></p>

                {!hasFile && (
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

                {hasFile && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-3 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                            <Icon size={16} />
                        </div>
                        <span className="flex-1 truncate">{value.name}</span>
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
                    className={hasFile ? "hidden" : "sr-only"}
                    tabIndex={hasFile ? -1 : 0}
                />
            </div>
        );
    };

    // ---- Step progress indicator ---------------------------------------------
    const renderProgress = () => (
        <div className="mb-6">
            <div className="flex items-center">
                {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const isDone = i < step;
                    const isActive = i === step;
                    return (
                        <div key={s.key} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${isDone
                                            ? "bg-emerald-500 border-emerald-500 text-white"
                                            : isActive
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-white border-gray-200 text-gray-300"
                                        }`}
                                >
                                    {isDone ? <Check size={16} /> : <Icon size={14} />}
                                </div>
                                <span className={`text-[11px] font-medium whitespace-nowrap ${isActive ? "text-blue-600" : isDone ? "text-emerald-600" : "text-gray-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-1.5 mb-4 rounded transition-colors ${i < step ? "bg-emerald-400" : "bg-gray-200"}`} />
                            )}
                        </div>
                    );
                })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
                Step {step + 1} of {STEPS.length}
                {STEPS[step].optional ? " · Optional — you can add this later" : ""}
            </p>
        </div>
    );

    return (
        <div className="flex-center min-h-screen bg-gray-50 p-4">
            <div className="w-[min(100%,460px)] bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                {/* Back */}
                {step === 0 ? (
                    <Link to={'/'}>
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-6">
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </Link>
                ) : (
                    <button
                        onClick={goBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-6"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                )}

                {/* Header */}
                <div className="mb-6">
                    <p className="font-bold text-2xl">Create account</p>
                    <p className="text-gray-500 text-sm">
                        Start your journey with us
                    </p>
                </div>

                {renderProgress()}

                <div className="space-y-4 min-h-70">

                    {/* STEP 1 — PERSONAL INFO */}
                    {step === 0 && (
                        <section className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    ref={firstNameRef}
                                    label="First Name"
                                    required
                                    name="firstName"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Input
                                    label="Last Name"
                                    required
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
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
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, sex: option }));
                                                clearError();
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="Email Address"
                                required
                                type="email"
                                name="email"
                                placeholder="you@email.com"
                                value={formData.email}
                                onChange={(e) => { handleInputChange(e); clearError(); }}
                                onKeyDown={handleKeyDown}
                            />
                        </section>
                    )}

                    {/* STEP 2 — SECURITY */}
                    {step === 1 && (
                        <section className="space-y-4">
                            <div className="relative">
                                <Input
                                    ref={firstNameRef}
                                    label="Password"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <p className="text-xs text-gray-400 mt-1">At least 6 characters.</p>
                            </div>

                            <div className="relative">
                                <Input
                                    label="Confirm Password"
                                    required
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                    className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </section>
                    )}

                    {/* STEP 3 — CONTACT & LINKS (optional) */}
                    {step === 2 && (
                        <section className="space-y-4">
                            <Input
                                ref={firstNameRef}
                                label="Phone Number"
                                name="phone"
                                placeholder="09XX XXX XXXX"
                                value={formData.phone}
                                onChange={(e) => { handleInputChange(e); clearError(); }}
                                onKeyDown={handleKeyDown}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    label="LinkedIn"
                                    name="linkedIn"
                                    placeholder="linkedin.com/in/username"
                                    value={formData.linkedIn}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <Input
                                    label="Portfolio"
                                    name="portfolio"
                                    placeholder="yourportfolio.com"
                                    value={formData.portfolio}
                                    onChange={(e) => { handleInputChange(e); clearError(); }}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </section>
                    )}

                    {/* STEP 4 — DOCUMENTS (optional) */}
                    {step === 3 && (
                        <section className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                {renderFileField({ name: "resume", label: "Resume", icon: FileTextIcon })}
                                {renderFileField({ name: "validId", label: "Valid ID", icon: IdCard })}
                            </div>
                        </section>
                    )}
                </div>

                {/* Error */}
                {errorMessage && (
                    <div className="mt-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center gap-3 mt-6">
                    {step > 0 && (
                        <button
                            type="button"
                            onClick={goBack}
                            className="flex-1 py-3 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                        >
                            Previous
                        </button>
                    )}

                    {!isLastStep && (
                        <button
                            type="button"
                            onClick={goNext}
                            className="flex-1 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-2"
                        >
                            {STEPS[step].optional ? "Continue" : "Next"}
                            <ArrowRight size={16} />
                        </button>
                    )}

                    {isLastStep && (
                        <button
                            type="button"
                            className={`flex-1 py-3 rounded-xl font-medium transition ${isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-emerald-500 hover:bg-emerald-600 text-white"
                                }`}
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    )}
                </div>

                {/* Skip optional step */}
                {STEPS[step].optional && !isLastStep && (
                    <button
                        type="button"
                        onClick={goNext}
                        className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-3"
                    >
                        Skip for now
                    </button>
                )}

                <hr className="border-gray-200 my-4" />

                <p className="text-gray-500 text-center text-sm">
                    Already have an account?{" "}
                    <Link to={'/login'}>
                        <span className="text-emerald-500 font-medium hover:underline">
                            Sign in
                        </span>
                    </Link>
                </p>
            </div>

            {/* Verify Email */}
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={() => navigate('/')}
                />
            )}
        </div>
    );
}