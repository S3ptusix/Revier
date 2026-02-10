import { LogIn } from "lucide-react";
import { useContext, useState } from "react"
import { toast } from "react-toastify";
import { fetchAdmin, loginAdmin } from "../services/authServices";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/AuthProvider";

export default function Login() {

    const { setAdmin } = useContext(UserContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { success, message } = await loginAdmin(formData);
            if (success) {
                const response = await fetchAdmin();
                console.log(response);
                setAdmin(response);

                return navigate('/app/dashboard');
                
            } else {
                toast.error(message, { toastId: 'submit-error' });
            }
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <img
                src="revier-icon.svg"
                alt="revier icon"
                className="h-16 mb-4"
            />
            <p className="text-gray-500 mb-8">Employment Agency Management System</p>
            <div className="border border-gray-200 p-4 w-[min(450px,100%)] rounded-xl">
                <p className="text-2xl font-semibold">Sign In</p>
                <p className="text-gray-500 mb-6">Enter your credentials to access the dashboard</p>

                <p className="input-label mb-1">Email Address</p>
                <input
                    type="email"
                    name="email"
                    placeholder="admin@email.com"
                    className="input w-full mb-4"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <p className="input-label mb-1">Password</p>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input w-full mb-4"
                    value={formData.password}
                    onChange={handleInputChange}
                />

                <button
                    className="btn bg-emerald-500 text-white gap-4 w-full rounded-lg"
                    onClick={handleSubmit}
                >
                    <LogIn size={16} />
                    Sign in
                </button>
            </div>
        </div>
    )
}