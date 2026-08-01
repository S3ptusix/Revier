import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/form";
import { fetchUser, handleLogin } from "../services/authServices";
import VerifyEmail from "../components/VerifyEmail";
import { UserContext } from "../context/AuthProvider";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";
import ForgotPassword from "../components/ForgotPassword";

export default function Login() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [openVerifyOtp, setOpenVerifyOtp] = useState(false);

    const emailRef = useRef(null);

    const { formData, handleInputChange } = useForm({
        email: '',
        password: ''
    });

    

    // Autofocus email
    useEffect(() => {
        emailRef.current?.focus();
    }, []);
                
    const validateForm = () => {
        if (!formData.email.trim()) return "Please enter your email.";
        if (!formData.password.trim()) return "Please enter your password.";
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) return setErrorMessage(error);

        try {
            setIsLoading(true);
            setErrorMessage('');

            const { success, message, isVerified } = await handleLogin(formData);

            if (success) {
                const result = await fetchUser();
                setUser(result);
                return navigate('/home');
            }

            if (isVerified === false) {
                setOpenVerifyEmail(true);
                return;
            }
            
            setErrorMessage(message || "Invalid credentials.");

        } catch (err) {
            console.error(err);
            setErrorMessage("Server error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <section className="flex-center min-h-screen bg-gray-50 p-4">
            <div className="w-[min(100%,420px)] bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

                {/* Back */}
                <Link to="/home">
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black mb-6">
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </Link>

                {/* Header */}
                <div className="mb-6">
                    <p className="text-2xl font-bold">Welcome back</p>
                    <p className="text-gray-500 text-sm">
                        Sign in to continue
                    </p>
                </div>

                {/* Email */}
                <div className="mb-4">
                    <Input
                        ref={emailRef}
                        label="Email"
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
                <div className="mb-2 relative">
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

                    {/* Toggle */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-9.5 text-gray-400 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Forgot Password */}
                <div className="text-right mb-4">
                    <button
                        className="text-sm text-emerald-500 hover:underline"
                        onClick={() => setOpenForgotPassword(true)}
                    >
                        Forgot password?
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
                    {isLoading ? "Signing in..." : "Sign in"}
                </button>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-emerald-500 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Verify Email Modal */}
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={() => navigate('/home')}
                />
            )}

            {openForgotPassword && (
                <ForgotPassword
                    onClose={() => setOpenForgotPassword(false)}
                    onNext={(email) => {
                        setEmail(email);
                        setOpenVerifyOtp(true);
                    }}
                />
            )}

            {openVerifyOtp && (
                <VerifyEmail
                    onClose={() => setOpenVerifyOtp(false)}
                    email={email}
                    successFunction={() => navigate('/dashboard')}
                />
            )}
        </section>
    );
}