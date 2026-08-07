import { LogIn, Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { fetchAdmin, loginAdmin } from "../services/authServices";
import { useNavigate, Navigate } from "react-router-dom";
import { UserContext } from "../context/AuthProvider";
import VerifyEmail from "../components/VerifyEmail";
import ForgotPassword from "../components/ForgotPassword";

export default function Login() {
    const { admin, setAdmin } = useContext(UserContext);
    const navigate = useNavigate();

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [openForgotPassword, setOpenForgotPassword] = useState(false);
    const [openVerifyOtp, setOpenVerifyOtp] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setErrorMessage(""); // clear error on typing

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {
        if (!formData.email) return "Email is required";
        if (!formData.password) return "Password is required";
        return null;
    };

    const handleSubmit = async () => {
        const validationError = validate();

        if (validationError) {
            setErrorMessage(validationError);
            toast.error(validationError);
            return;
        }

        try {
            setIsSubmitting(true);

            const { success, message, isVerified } = await loginAdmin(formData);
 
            if (success) {
                const response = await fetchAdmin();
                setAdmin(response);
                navigate("/app/dashboard");
                return;
            }

            if (isVerified === false) {
                setOpenVerifyEmail(true);
                return;
            }

            setErrorMessage(message);
            toast.error(message, { toastId: "submit-error" });

        } catch (error) {
            console.error("Error on handleSubmit:", error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    if (admin) return <Navigate to="/app/dashboard" replace />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {/* HEADER */}
            <img src="revier-icon.svg" alt="revier icon" className="h-16 mb-4" />
            <p className="text-gray-500 mb-8">
                Employment Agency Management System
            </p>

            {/* CARD */}
            <div className="border border-gray-200 p-6 w-[min(450px,100%)] rounded-xl shadow-sm">
                <p className="text-2xl font-semibold">Sign In</p>
                <p className="text-gray-500 mb-6">
                    Enter your credentials to access the dashboard
                </p>

                {/* ERROR */}
                {errorMessage && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* EMAIL */}
                <p className="input-label mb-1">Email Address</p>
                <input
                    autoFocus
                    type="email"
                    name="email"
                    placeholder="admin@email.com"
                    className="input w-full mb-4"
                    value={formData.email}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                {/* PASSWORD */}
                <p className="input-label mb-1">Password</p>
                <div className="relative mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        className="input w-full pr-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword((prev) => !prev)}
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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


                {/* SUBMIT */}
                <button
                    disabled={isSubmitting}
                    className={`btn w-full rounded-lg text-white gap-3
                        ${isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                    onClick={handleSubmit}
                >
                    <LogIn size={16} />
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </div>

            {/* VERIFY EMAIL */}
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={() => window.location.reload()}
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
                    successFunction={() => window.location.reload()}
                />
            )}
        </div>
    );
}