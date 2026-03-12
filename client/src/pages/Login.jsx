import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/form";
import { fetchUser, handleLogin } from "../services/authServices";
import VerifyEmail from "../components/verifyEmail";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Login() {

    const { setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

    const { formData, handleInputChange } = useForm({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        try {
            const { success, message, isVerified } = await handleLogin(formData);
            if (success) {
                const result = await fetchUser();
                setUser(result);
                navigate('/home');
            } else {
                setErrorMessage(message);
                if (isVerified) return setOpenVerifyEmail(true);

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

                <p className="font-bold text-2xl mb-2">Sign in</p>
                <p className="text-gray-500 mb-6">Enter your credentials to access your account</p>

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

                {errorMessage &&
                    <div className="mb-4">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <div className="flex justify-end mb-4">
                    <Link>
                        <p className="text-emerald-500 font-semibold">Forgot password?</p>
                    </Link>
                </div>

                <button
                    className="btn bg-emerald-500 text-white py-6 w-full rounded-lg"
                    onClick={handleSubmit}
                >
                    Sign in
                </button>

                <hr className="border-gray-200 my-4" />

                <p className="text-gray-500 text-center">Don't have an account? <Link to={'/register'}><span className="text-emerald-500">Sign up</span></Link></p>
            </div>

            {openVerifyEmail &&
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={formData.email}
                    successFunction={() => navigate('/home')}
                />
            }
        </div>
    )
}