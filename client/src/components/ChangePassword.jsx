import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from "./ui/Input";
import { useForm } from "../hooks/form";
import { changePassword } from "../services/userServices";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { UserContext } from "../context/AuthProvider";
import Loading from "./Loading";
import { logoutUser } from "../services/authServices";

export default function ChangePassword({ onClose }) {

    const { setUser } = useContext(UserContext);

    const [isReStarting, setIsReStarting] = useState(false);

    const { formData, handleInputChange } = useForm({
        password: '',
        confirmPassword: '',
    })

    const handleSubmit = async () => {
        try {
            const { success, message } = await changePassword(formData);
            if (success) {
                setIsReStarting(true);
                await logoutUser();
                setTimeout(() => {
                    setIsReStarting(false);
                    setUser(null);
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
                    <div className="mb-8">
                        <ModalHeader
                            title="Change Password"
                            onClose={onClose}
                        />
                    </div>
                    <div className="space-y-4 mb-8">
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
                    </div>
                    <ModalFooter
                        submitLabel="Change Password"
                        onSubmit={handleSubmit}
                        onClose={onClose}
                    />
                </Modal>
            </ModalBackground>
            {isReStarting && (
                <ModalBackground>
                    <Modal>
                        <p className='text-center mb-4'>
                            Your password has been changed successfully. For security purposes, you will now be logged out.
                        </p>
                        <Loading />
                    </Modal>
                </ModalBackground>
            )}
        </>
    )
}