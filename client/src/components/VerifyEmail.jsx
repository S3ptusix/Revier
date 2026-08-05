/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { CircleCheckBig, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import OtpInput from "react-otp-input";
import { otpVerify, sendOtp, sendOtpNoCookie } from "../services/otpServices";
import { UserContext } from "../context/AuthProvider";
import { fetchUser } from "../services/authServices";
import { Modal, ModalBackground, ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";
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

        setResendCoolDown(30); // 30s coolDown

        try {

            const { success, message } = await sendOtpNoCookie(email);

            if (success) return toast.success(message);
            toast.error(message);

        } catch (error) {
            toast.error("Failed to resend code");
        }
    };

    useEffect(() => {
        setResendCoolDown(30);
    }, []);

    return (
        <ModalBackground>
            <Modal>

                <ModalHeader
                    title="Verify Your Email"
                    subTitle="Enter the 6-digit code sent to"
                    onClose={onClose}
                />

                <ModalBody>

                    <p className="text-center text-sm font-semibold">
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

                    <p className="text-gray-400 text-xs text-center">
                        Didn’t receive the code? Check spam or request a new one.
                    </p>

                </ModalBody>

                <ModalFooter
                    cancelLabel={resendCoolDown > 0
                        ? `Resend in ${resendCoolDown}s`
                        : "Resend Code"}
                    disableCancel={resendCoolDown > 0}
                    onClose={handleResend}

                    submitLabel={isSubmitting ? "Verifying..." : "Verify Email"}
                    disableSubmit={isSubmitting || otp.length !== 6}
                    onSubmit={handleSubmit}
                />

            </Modal>
        </ModalBackground>
    );
}