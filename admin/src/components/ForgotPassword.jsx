/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Modal, ModalBackground, ModalHeader, ModalFooter, ModalBody } from "./ui/ui-modal";
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
            <Modal>
                <ModalHeader
                    title="Forgot Password"
                    subTitle="Enter your email to receive a verification code."
                    onClose={onClose}
                />

                <ModalBody>
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </ModalBody>

                <ModalFooter
                    submitLabel={isSubmitting ? "Sending..." : "Send OTP"}
                    onSubmit={handleSubmit}
                    onClose={onClose}
                    disableSubmit={isSubmitting}
                />
            </Modal>
        </ModalBackground>
    );
}