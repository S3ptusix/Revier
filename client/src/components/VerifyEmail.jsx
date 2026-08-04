/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircleCheckBig, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import OtpInput from "react-otp-input";
import { otpVerify, sendOtp } from "../services/otpServices";
import { UserContext } from "../context/AuthProvider";
import { fetchUser } from "../services/authServices";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { toast } from "react-toastify";

export default function VerifyEmail({ onClose, email, successFunction = () => { } }) {

    const { setUser } = useContext(UserContext);

    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCoolDown, setResendCoolDown] = useState(0);

    // ⏱️ coolDown timer
    useEffect(() => {
        if (resendCoolDown <= 0) return;
        const timer = setTimeout(() => setResendCoolDown(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCoolDown]);

    // ✅ auto-submit when OTP complete
    useEffect(() => {
        if (otp.length === 6) {
            handleSubmit();
        }
    }, [otp]);

    const handleSubmit = async () => {
        if (otp.length !== 6) return;

        try {
            setIsSubmitting(true);
            setErrorMessage("");

            const { success, message } = await otpVerify({ email, otp });

            if (success) {
                const user = await fetchUser();
                setUser(user);

                // toast.success("Email verified successfully 🎉");

                onClose();
                successFunction();
            } else {
                setErrorMessage(message || "Invalid verification code");
            }
        } catch (error) {
            console.error("Error on handleSubmit:", error);
            setErrorMessage("Something went wrong. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (resendCoolDown > 0) return;

        try {
            // 🔥 call your resend API here
            const { success, message } = await sendOtp();

            if (success) return toast.success(message);
            toast.error(message);

            toast.success("Verification code resent");
            setResendCoolDown(30); // 30s coolDown
        } catch (error) {
            toast.error("Failed to resend code");
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={420}>

                <ModalHeader onClose={onClose} />

                {/* ICON */}
                <div className="bg-emerald-500/10 text-emerald-500 p-4 w-fit rounded-full mx-auto mb-4">
                    <Mail size={22} />
                </div>

                {/* TITLE */}
                <h2 className="text-center font-bold text-xl mb-1">
                    Verify Your Email
                </h2>

                <p className="text-center text-gray-500 text-sm mb-1">
                    Enter the 6-digit code sent to
                </p>

                <p className="text-center font-semibold mb-6 break-all">
                    {email}
                </p>

                {/* OTP INPUT */}
                <OtpInput
                    value={otp}
                    onChange={(value) => {
                        setOtp(value.replace(/\D/g, ""));
                        setErrorMessage("");
                    }}
                    numInputs={6}
                    shouldAutoFocus
                    containerStyle={{
                        gap: "10px",
                        marginBottom: "20px",
                        justifyContent: "center"
                    }}
                    renderInput={(props) => (
                        <input
                            {...props}
                            className="flex-1 border border-gray-300 bg-gray-50 rounded-lg py-4 font-bold focus:outline-2 outline-emerald-500"
                        />
                    )}
                />

                {/* ERROR */}
                {errorMessage && (
                    <p className="mb-4 text-red-500 text-center text-sm">
                        {errorMessage}
                    </p>
                )}

                {/* VERIFY BUTTON */}
                <button
                    className="flex items-center justify-center gap-2 rounded-xl font-semibold bg-emerald-500 text-white py-3 w-full mb-4 disabled:opacity-50"
                    onClick={handleSubmit}
                    disabled={isSubmitting || otp.length !== 6}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <CircleCheckBig size={18} />
                    )}
                    {isSubmitting ? "Verifying..." : "Verify Email"}
                </button>

                {/* RESEND */}
                <div className="text-center mb-4">
                    <button
                        onClick={handleResend}
                        disabled={resendCoolDown > 0}
                        className="text-emerald-500 font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        {resendCoolDown > 0
                            ? `Resend in ${resendCoolDown}s`
                            : "Resend Code"}
                    </button>
                </div>

                {/* FOOTNOTE */}
                <p className="text-gray-400 text-xs text-center">
                    Didn’t receive the code? Check spam or request a new one.
                </p>

            </Modal>
        </ModalBackground>
    );
}