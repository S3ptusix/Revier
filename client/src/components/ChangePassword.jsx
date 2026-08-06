import {
    Modal,
    ModalBackground,
    ModalBody,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";
import Input from "./ui/Input";
import { useForm } from "../hooks/form";
import { changePassword } from "../services/userServices";
import { useContext, useState } from "react";
import { UserContext } from "../context/AuthProvider";
import { logoutUser } from "../services/authServices";
import { Eye, EyeOff, ShieldCheck, Loader2, LogOut } from "lucide-react";

export default function ChangePassword({ onClose }) {

    const { setUser } = useContext(UserContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const { formData, handleInputChange } = useForm({
        password: '',
        confirmPassword: '',
    });

    // ✅ VALIDATION
    const validate = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setIsSubmitting(true);

            const { success, message } = await changePassword(formData);

            if (success) {

                // 🔐 show "logging out" state, then log the user out
                setIsLoggingOut(true);
                await logoutUser();
                setUser(null);
            } else {
                setErrors({ general: message });
            }
        } catch (error) {
            console.error(error);
            setErrors({ general: "Something went wrong" });
        } finally {
            setIsSubmitting(false);
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <ModalBackground>
                <Modal>

                    {!isLoggingOut ? (
                        <>
                            <ModalHeader
                                title="Change Password"
                                subTitle="For your security, you’ll be logged out after changing your password."
                                onClose={onClose}
                            />

                            {/* FORM */}
                            <ModalBody>

                                {/* PASSWORD */}
                                <div className="relative">
                                    <Input
                                        label="New Password"
                                        required
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-9 text-gray-400"
                                        onClick={() => setShowPassword(p => !p)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                    )}
                                </div>

                                {/* CONFIRM */}
                                <div>
                                    <Input
                                        label="Confirm Password"
                                        required
                                        name="confirmPassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* HINT */}
                                <p className="text-xs text-gray-400">
                                    Use at least 8 characters. Include letters and numbers for stronger security.
                                </p>
                                {/* GENERAL ERROR */}
                                {errors.general && (
                                    <p className="text-red-500 text-sm mb-4">
                                        {errors.general}
                                    </p>
                                )}
                            </ModalBody>


                            {/* FOOTER */}
                            <ModalFooter
                                submitLabel={isSubmitting ? "Updating..." : "Change Password"}
                                onSubmit={handleSubmit}
                                onClose={onClose}
                                disabled={isSubmitting}
                            />
                        </>
                    ) : (
                        <>
                            {/* LOGGING OUT STATE */}
                            <div className="text-center py-10 px-6">
                                <div className="bg-blue-500/10 text-blue-500 p-4 rounded-full w-fit mx-auto mb-4">
                                    <LogOut size={28} />
                                </div>

                                <h3 className="font-semibold text-lg mb-2">
                                    Logging You Out
                                </h3>

                                <p className="text-sm text-gray-500 mb-4">
                                    Your password was updated. Hang tight while we log you out for security.
                                </p>

                                <Loader2 className="animate-spin mx-auto text-blue-500" />
                            </div>
                        </>
                    )}
                </Modal>
            </ModalBackground>
        </>
    );
}