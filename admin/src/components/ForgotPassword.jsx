/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Modal, ModalBackground, ModalHeader, ModalFooter } from "./ui/ui-modal";
import Input from "./ui/Input";
import { toast } from "react-toastify";
import { sendOtpForgotPassword } from "../services/otpServices";

export default function ForgotPassword({ onClose, onNext }) {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            const { success, message } = await sendOtpForgotPassword({ email });

            if (success) {
                toast.success("OTP sent to your email");
                onClose();
                onNext(email); // go to verify modal
            } else {
                setError(message);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalBackground>
            <Modal maxWidth={420}>
                <ModalHeader title="Forgot Password" onClose={onClose} />

                <p className="text-sm text-gray-500 mb-6">
                    Enter your email to receive a verification code.
                </p>

                <Input
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-6">
                    <ModalFooter
                        submitLabel={isSubmitting ? "Sending..." : "Send OTP"}
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        disabled={isSubmitting}
                    />
                </div>
            </Modal>
        </ModalBackground>
    );
}