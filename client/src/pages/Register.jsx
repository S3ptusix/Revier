import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { handleRegister } from "../services/authServices";
import { useForm } from "../hooks/form";
import { useState } from "react";
import VerifyEmail from "../components/VerifyEmail";
import Input from "../components/ui/Input";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function Register() {

    const navigate = useNavigate();

    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: 'Male',
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
        <div className="flex-center min-h-screen p-4">
            <div className="w-[min(100%,450px)]">
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
                        label="First Name"
                        required={true}
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Last Name"
                        required={true}
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <p className="input-label mb-1">Sex<span className="text-red-500">*</span></p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            className={`btn rounded-xl bg-blue-500 text-white ${formData.sex === 'Male' ? '' : 'opacity-50 brightness-75'}`}
                            onClick={() => setFormData(prev => ({ ...prev, sex: 'Male' }))}
                        >
                            <p>Male</p>
                        </button>
                        <button
                            className={`btn rounded-xl bg-pink-500 text-white ${formData.sex === 'Female' ? '' : 'opacity-50 brightness-75'}`}
                            onClick={() => setFormData(prev => ({ ...prev, sex: 'Female' }))}
                        >
                            <p>Female</p>
                        </button>
                    </div>
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
                    className="btn bg-emerald-500 text-white py-6 w-full rounded-xl"
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
                    successFunction={() => navigate('/home')}
                />
            }
        </div>
    )
}