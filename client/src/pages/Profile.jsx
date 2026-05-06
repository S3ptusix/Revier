/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import Topbar from "../components/Topbar";
import Input from "../components/ui/Input";
import { Link } from "react-router-dom";
import { editUserProfile, fetchUserProfile } from "../services/userServices";
import { useForm } from "../hooks/form";
import { toast } from "react-toastify";
import { FileText, FileTextIcon, IdCard } from "lucide-react";

export default function Profile() {

    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: '',
        lastName: '',
        sex: '',
        email: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: {},
        validId: {}
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await editUserProfile(formData);
            if (success) return toast.success(message);
            toast.error(message);
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
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            label="First Name"
                            name="firstName"
                            required={true}
                            value={formData?.firstName}
                            placeholder="John"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="last Name"
                            name="lastName"
                            required={true}
                            value={formData?.lastName}
                            placeholder="Doe"
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

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            disabled={true}
                            label="Email Address"
                            name="email"
                            required={true}
                            value={formData?.email}
                            placeholder="jahleel@gmail.com"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Phone Number"
                            name="phone"
                            value={formData?.phone || ''}
                            placeholder="+63 91 234 5678"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="LinkedIn"
                            name="linkedIn"
                            value={formData?.linkedIn || ''}
                            placeholder="https://linkedin.com/in/johndoe"
                            onChange={handleInputChange}
                        />
                        <Input
                            label="Portfolio"
                            name="portfolio"
                            value={formData?.portfolio || ''}
                            placeholder="https://johndoe.com"
                            onChange={handleInputChange}
                        />
                        <div>
                            <Input
                                label="Resume"
                                type="file"
                                name="resume"
                                accept=".pdf"
                                onChange={handleInputChange}
                            />
                            {/* {formData.resume && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected file: {typeof formData?.resume === 'string' ? formData.resume : formData.resume.name}
                                </p>
                            )} */}

                            {formData?.resume &&
                                <a
                                    href={`${API_URL}/uploads/resumes/${formData?.resume}`}
                                    target="_blank"
                                    className='mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-4 rounded-xl'
                                >
                                    <FileTextIcon />
                                    {typeof formData?.resume === 'string' ? formData.resume : formData.resume.name}
                                </a>
                            }
                        </div>
                        <div className="mb-4">
                            <Input
                                label="Valid ID (Driver's License, Passport, etc.)"
                                type="file"
                                name="validId"
                                accept=".pdf"
                                onChange={handleInputChange}
                            />
                            {/* {formData.validId && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected file: {typeof formData?.validId === 'string' ? formData.validId : formData.validId.name}
                                </p>
                            )} */}

                            {formData?.validId &&
                                <a
                                    href={`${API_URL}/uploads/validIds/${formData?.validId}`}
                                    target="_blank"
                                    className='mt-2 flex-center gap-2 bg-emerald-500 text-white text-sm p-4 rounded-xl'
                                >
                                    <IdCard />
                                    {typeof formData?.validId === 'string' ? formData.validId : formData.validId.name}
                                </a>
                            }
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}