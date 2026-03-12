import { CircleCheckBig, Mail, RefreshCw, X } from "lucide-react";
import { useState } from "react";
import OtpInput from 'react-otp-input';
import { otpVerify } from "../services/otpServices";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { fetchUser } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";

export default function VerifyEmail({onClose, email, successFunction = () => { } }) {

    const navigate = useNavigate();

    const { setUser } = useContext(UserContext);

    const [otp, setOtp] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const handleSumbit = async () => {
        try {
            const { success, message } = await otpVerify({ email, otp });
            if (success) {
                const response = await fetchUser();
                setUser(response);
                onClose();
                successFunction();
                navigate('/home');
            } else {
                setErrorMessage(message);
            }
        } catch (error) {
            console.error("Error on handleSubmit:", error);
        }
    }

    return (
        <ModalBackground>
            <Modal>
                <ModalHeader
                    onClose={onClose}
                />
                <div className="bg-emerald-500/10 text-emerald-500 p-4 w-fit rounded-full mx-auto mb-4">
                    <Mail />
                </div>
                <p className="text-center font-bold text-2xl mb-2">Verify Your Email</p>
                <p className="text-center text-gray-500">We've sent a 6-digit verification code to</p>
                <p className="text-center font-semibold mb-6">{email}</p>

                <OtpInput
                    value={otp}
                    onChange={(value) => setOtp(value.replace(/\D/g, ""))}
                    numInputs={6}
                    containerStyle={{
                        gap: "8px",
                        marginBottom: '16px'
                    }}
                    renderInput={(props) => <input {...props} className="flex-1 border border-gray-300 bg-gray-100 rounded-lg py-4 font-bold focus:outline-2 outline-emerald-500" />}
                />

                {errorMessage &&
                    <p className="mb-4 text-red-500 text-center bg-red-500/10 p-2 rounded-lg">{errorMessage}</p>
                }
                <button
                    className="flex-center gap-2 rounded-xl font-semibold bg-emerald-500 text-white p-4 w-full mb-4 cursor-pointer"
                    onClick={handleSumbit}
                >
                    <CircleCheckBig size={20} />
                    Verify Email
                </button>
                <div className="flex justify-center mb-6">
                    <button className="flex-center gap-2 mx-auto cursor-pointer text-emerald-500 font-semibold">
                        <RefreshCw size={20} />
                        Resend Code
                    </button>
                </div>

                <p className="text-gray-500 text-sm">Didn't receive the code? Check your spam folder or <span className="text-emerald-500 font-semibold">resend it.</span></p>
            </Modal>
        </ModalBackground>
    )
}