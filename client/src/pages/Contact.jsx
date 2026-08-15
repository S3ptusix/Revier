import { Building2, Clock, Mail, MapPin, Phone, Search, Shield, Target, Users, Zap } from "lucide-react";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { useForm } from "../hooks/form";
import { useState } from "react";
import { Modal } from "../components/ui/ui-modal";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import callCenter from '../assets/call-center.png';
import PhilippinePhoneInput from "../components/ui/PhilippinePhoneInput";

export default function Contact() {

    const contactSection = {
        title: "Get in Touch",
        subTitle: "Gen in touch with us using the enquiry form or contact details below",
        details: {
            email: "revierconsultants@yahoo.com",
            phone: "0921 444 9014",
            location: "3rd floor, S-Drive Center Building, General Malvar St., Brgy. Tubigan, Binãn, Philippines",
        }
    }


    const { formData, setFormData, handleInputChange } = useForm({
        firstName: "",
        lastName: "",
        to_email: "",
        phone: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleSubmit = async () => {

        setLoading(true);
        setStatus("");
        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    to_email: formData.to_email,
                    phone: formData.phone,
                    message: formData.message
                },
                {
                    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                }
            );

            setStatus("Email sent successfully!");

            setFormData({
                firstName: "",
                lastName: "",
                to_email: "",
                phone: "",
                message: ""
            });

        } catch (error) {
            console.error("EmailJS error:", error);
            setStatus("Failed to send email.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col">
            <TopBar />
            <section className="px-4 md:px-[10vw] min-h-screen pb-20">
                <div className="relative grid sm:grid-cols-2 overflow-hidden bg-emerald-500 text-white py-24 mb-16 px-8 rounded-xl">

                    <img
                        src={callCenter}
                        alt="call center"
                        className="absolute top-0 bottom-0 right-0 left-1/2 w-1/2 h-full object-cover max-sm:hidden"
                        style={{
                            maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)",
                        }}
                    />

                    <div className="max-sm:flex flex-col justify-center items-center">
                        <p className="text-4xl font-semibold mb-4 capitalize">{contactSection?.title}</p>
                        <p className="text-sm">{contactSection?.subTitle}</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">

                    <div className="flex-center">
                        <div className="w-full rounded-xl bg-white space-y-4 p-4 shadow-xl border border-gray-200">

                            <div className="grid grid-cols-2 gap-4">

                                <Input
                                    label="First Name"
                                    required
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="John"
                                />

                                <Input
                                    label="Last Name"
                                    required
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Doe"
                                />

                            </div>

                            <Input
                                label="Email"
                                required
                                name="to_email"
                                value={formData.to_email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                            />

                            <PhilippinePhoneInput
                                required
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />

                            <Textarea
                                label="Message"
                                required
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="tell us how we can help"
                            />

                            {status ? (
                                <p className={`text-sm ${status.includes("success") ? "text-emerald-600" : "text-red-500"}`}>
                                    {status}
                                </p>
                            ) : null}

                            <button
                                onClick={handleSubmit}
                                disabled={
                                    loading ||
                                    !formData.firstName.trim() ||
                                    !formData.lastName.trim() ||
                                    !formData.to_email.trim() ||
                                    !formData.message.trim()
                                }
                                className="btn rounded-lg bg-emerald-500 text-white shadow-none border-none w-full disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <Mail />
                            </div>
                            <div>
                                <p>Quick Contact</p>
                                <p className="text-sm">Email: {contactSection?.details?.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <Phone />
                            </div>
                            <div>
                                <p>Phone Number</p>
                                <p className="text-sm">PH 63 + {contactSection?.details?.phone}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <MapPin />
                            </div>
                            <div>
                                <p>Location</p>
                                <p className="text-sm">{contactSection?.details?.location}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}