import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { handleRegister } from "../services/authServices";
import { useForm } from "../hooks/form";
import { useState } from "react";
import VerifyEmail from "../components/verifyEmail";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Register() {
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);


    const { formData, handleInputChange } = useForm({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const { success, message } = await handleRegister(formData);
            if (success) {
                setOpenVerifyEmail(true);
            } else {
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error on handleSubmit:', error);
        }
    }

    return (
        <div className="flex-center flex-col min-h-screen">
            <img
                src="/revier-icon.svg"
                alt="revier icon"
                className="h-16 mb-8"
            />
            <div className="border border-gray-200 rounded-xl p-4 shadow-lg w-[min(100%,450px)]">
                <Link to={'/home'}>
                    <button className="flex gap-2 font-semibold cursor-pointer mb-6">
                        <ArrowLeft />
                        Back
                    </button>
                </Link>

                <p className="font-bold text-2xl mb-2">Create Account</p>
                <p className="text-gray-500 mb-6">Fill in your details to get started</p>

                <div className="mb-4">
                    <Input
                        label="Fullname"
                        required={true}
                        type="text"
                        name="fullname"
                        placeholder="Jahleel Casintahan"
                        value={formData.fullname}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Email Address"
                        required={true}
                        type="email"
                        name="email"
                        placeholder="jahleel@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Password"
                        required={true}
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Confirm Password"
                        required={true}
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <button
                    className="btn bg-emerald-500 text-white py-6 w-full rounded-lg"
                    onClick={handleSubmit}
                >
                    Create Account
                </button>

                <hr className="border-gray-200 my-4" />

                <p className="text-gray-500 text-center">Already have an account? <Link to={'/login'}><span className="text-emerald-500">Sign in</span></Link></p>
            </div>

            {openVerifyEmail &&
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                />
            }
        </div>
    )
}