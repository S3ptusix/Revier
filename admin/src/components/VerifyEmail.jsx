/* eslint-disable react-hooks/exhaustive-deps */
import { CircleCheckBig, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { otpVerify } from "../services/otpServices";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import { toast } from "react-toastify";

export default function VerifyEmail({ onClose, email, successFunction = () => { } }) {

    const [otp, setOtp] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [coolDown, setCoolDown] = useState(0);

    // ⏱️ resend coolDown timer
    useEffect(() => {
        if (coolDown <= 0) return;
        const timer = setTimeout(() => setCoolDown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [coolDown]);

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
                toast.success("Email verified 🎉");
                onClose();
                successFunction();
            } else {
                setErrorMessage(message || "Invalid code");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (coolDown > 0) return;

        try {
            // 👉 call your resend API here
            // await resendOtp(email);

            toast.success("Code resent");
            setCoolDown(30);
        } catch {
            toast.error("Failed to resend");
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
                    Verify your email
                </h2>

                <p className="text-center text-gray-500 text-sm">
                    Enter the 6-digit code sent to
                </p>

                <p className="text-center font-semibold mb-6 break-all">
                    {email}
                </p>

                {/* OTP */}
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
                        justifyContent: "center",
                        marginBottom: "20px"
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
                    <p className="text-red-500 text-sm text-center mb-4">
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
                        disabled={coolDown > 0}
                        className="text-emerald-500 font-semibold flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    >
                        <RefreshCw size={16} />
                        {coolDown > 0
                            ? `Resend in ${coolDown}s`
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