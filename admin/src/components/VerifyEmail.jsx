/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { CircleCheckBig, Mail, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { otpVerify, sendOtpNoCookie } from "../services/otpServices";
import { Modal, ModalBackground, ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";
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

        setCoolDown(30); // 30s coolDown

        try {

            const { success, message } = await sendOtpNoCookie(email);

            if (success) return toast.success(message);
            toast.error(message);

        } catch (error) {
            toast.error("Failed to resend code");
        }
    };

    useEffect(() => {
        setCoolDown(30);
    }, []);


    return (
        <ModalBackground>
            <Modal maxWidth={420}>

                <ModalHeader
                    title="Verify your email"
                    subTitle="Enter the 6-digit code sent to"
                    onClose={onClose}
                />

                <ModalBody>

                    <p className="text-center text-sm font-semibold">
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
                        <p className="text-red-500 text-sm text-center">
                            {errorMessage}
                        </p>
                    )}


                    {/* FOOTNOTE */}
                    <p className="text-gray-400 text-xs text-center">
                        Didn’t receive the code? Check spam or request a new one.
                    </p>
                </ModalBody>
                <ModalFooter
                    cancelLabel={coolDown > 0
                        ? `Resend in ${coolDown}s`
                        : "Resend Code"}
                    submitLabel={isSubmitting ? "Verifying..." : "Verify Email"}
                    onClose={handleResend}
                    onSubmit={handleSubmit}
                    disableSubmit={isSubmitting}
                    disableCancel={coolDown > 0}
                />

            </Modal>
        </ModalBackground>
    );
}