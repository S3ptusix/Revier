/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import Topbar from "../components/Topbar";
import Input from "../components/ui/Input";
import TagInput from "../components/ui/TagInput";
import Textarea from "../components/ui/Textarea";
import { Link } from "react-router-dom";
import { editUserProfile, fetchUserProfile } from "../services/userServices";
import { useForm } from "../hooks/form";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Profile() {

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, setFormData, handleInputChange } = useForm({
        fullname: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await editUserProfile(formData);
            if (success) return toast.success(message);
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error);
        }
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { success, message, user } = await fetchUserProfile();
                if (success) return setFormData(user);
            } catch (error) {
                console.error('Error on loadProfile:', error);
            }
        }
        loadProfile();
    }, []);

    return (
        <div className="flex flex-col max-h-screen">
            <Topbar />
            <div className="relative grow overflow-auto px-[10vw]">
                <div className="sticky top-0 bg-white flex justify-end gap-4 py-4 z-10">
                    <Link to="/dashboard">
                        <button className="btn btn-ghost rounded-lg">Cancel</button>
                    </Link>
                    <button
                        className="btn bg-emerald-500 text-white rounded-lg"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                </div>

                <section className="rounded-xl border border-gray-200 p-4 mb-8">
                    <p className="text-lg font-semibold mb-4">Personal Information</p>

                    <div className="mb-4">
                        <Input
                            label="Full Name"
                            name="fullname"
                            value={formData?.fullname}
                            placeholder="Jahleel Casintahan"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            disabled={true}
                            label="Email Address"
                            name="email"
                            value={formData?.email}
                            placeholder="jahleel@gmail.com"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData?.phone}
                            placeholder="+63 91 234 5678"
                            onChange={handleInputChange}
                        />
                    </div>
                </section>

                {/* <section className="rounded-xl border border-gray-200 p-4 mb-8">
                    <p className="text-lg font-semibold mb-2">Resume / CV</p>
                    <p className="text-gray-500 text-sm mb-4">Upload your resume to apply faster</p>
                 </section> */}
            </div>
        </div>
    )
}