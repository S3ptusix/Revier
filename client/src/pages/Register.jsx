import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../services/authServices";
import { useForm } from "../hooks/form";
import { useState, useRef, useEffect } from "react";
import VerifyEmail from "../components/VerifyEmail";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Register() {
    const navigate = useNavigate();

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const firstNameRef = useRef(null);

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: 'Male',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Autofocus
    useEffect(() => {
        firstNameRef.current?.focus();
    }, []);

    const validateForm = () => {
        if (!formData.firstName.trim()) return "First name is required.";
        if (!formData.lastName.trim()) return "Last name is required.";
        if (!formData.email.trim()) return "Email is required.";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Invalid email format.";
        if (!formData.password) return "Password is required.";
        if (formData.password.length < 6) return "Password must be at least 6 characters.";
        if (!formData.confirmPassword) return "Please confirm your password.";
        if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) return setErrorMessage(error);

        try {
            setIsLoading(true);
            setErrorMessage('');

            const { success, message } = await handleRegister(formData);

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

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <div className="flex-center min-h-screen bg-gray-50 p-4">
            <div className="w-[min(100%,420px)] bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                {/* Back */}
                <Link to={'/home'}>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-6">
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <p className="font-bold text-2xl">Create account</p>
                    <p className="text-gray-500 text-sm">
                        Start your journey with us
                    </p>
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <Input
                        ref={firstNameRef}
                        label="First Name"
                        required
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => {
                            handleInputChange(e);
                            setErrorMessage('');
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <Input
                        label="Last Name"
                        required
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => {
                            handleInputChange(e);
                            setErrorMessage('');
                        }}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Sex */}
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
                </div>

                {/* Email */}
                <div className="mb-4">
                    <Input
                        label="Email Address"
                        required
                        type="email"
                        name="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={(e) => {
                            handleInputChange(e);
                            setErrorMessage('');
                        }}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <Input
                        label="Password"
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => {
                            handleInputChange(e);
                            setErrorMessage('');
                        }}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="mb-4 relative">
                    <Input
                        label="Confirm Password"
                        required
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                            handleInputChange(e);
                            setErrorMessage('');
                        }}
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

                {/* Error */}
                {errorMessage && (
                    <div className="mb-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                )}

                {/* Submit */}
                <button
                    className={`w-full py-3 rounded-xl font-medium transition ${isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                        }`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? "Creating account..." : "Create Account"}
                </button>

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
                    successFunction={() => navigate('/home')}
                />
            )}
        </div>
    );
}