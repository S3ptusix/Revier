import { LogIn } from "lucide-react";
import { UserContext } from "../context/AuthProvider";
import VerifyEmail from "./VerifyEmail";
import { Navigate } from "react-router-dom";
import { Modal, ModalBackground, ModalBody, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import { useForm } from "../hooks/form";
import { changePassword } from "../services/adminServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { useContext } from "react";
import Loading from "./Loading";
import { logoutAdmin } from "../services/authServices";

export default function ChangePassword({ onClose = () => { } }) {

    const [isReStarting, setIsReStarting] = useState(false);

    const { setAdmin } = useContext(UserContext);

    const { formData, handleInputChange } = useForm({
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async () => {
        try {
            const { success, message } = await changePassword(formData);
            if (success) {
                setIsReStarting(true);
                await logoutAdmin()
                setTimeout(() => {
                    setIsReStarting(false);
                    setAdmin(null);
                }, 2000);
                return
            };
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ModalBackground>
                <Modal>
                    <ModalHeader
                        title="Change Password"
                        onClose={onClose}
                    />

                    <ModalBody>
                        <Input
                            label="Password"
                            required={true}
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Confirm Password"
                            required={true}
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </ModalBody>

                    <ModalFooter
                        submitLabel={isReStarting ? "Changing Password..." : "Change Password"}
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        disableSubmit={isReStarting}
                    />
                </Modal>
            </ModalBackground>
            {isReStarting && (
                <ModalBackground>
                    <Modal>
                        <ModalBody>
                            <p className='text-center text-sm'>
                                Your password has been changed successfully. For security purposes, you will now be logged out.
                            </p>
                            <Loading />
                        </ModalBody>
                    </Modal>
                </ModalBackground>
            )}
        </>
    )
}