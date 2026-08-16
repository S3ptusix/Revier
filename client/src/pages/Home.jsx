import {
    Mail,
    MapPin,
    Phone,
} from "lucide-react";

import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";

import emailjs from "@emailjs/browser";
import { useForm } from "../hooks/form";
import { useEffect, useState } from "react";

import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import PhilippinePhoneInput from "../components/ui/PhilippinePhoneInput";

import { contactSchema } from "../utils/schemas/contactSchema";

import { fetchHomeContent } from "../services/systemContentHomeServices";

export default function Home() {
    // =========================
    // HOME CONTENT STATE
    // =========================

    const [homeContent, setHomeContent] = useState(null);
    const [homeLoading, setHomeLoading] = useState(true);

    // =========================
    // CONTACT FORM STATE
    // =========================

    const { formData, setFormData, handleInputChange } = useForm({
        firstName: "",
        lastName: "",
        to_email: "",
        phone: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    // =========================
    // FETCH HOME CONTENT
    // =========================

    useEffect(() => {
        const loadHomeContent = async () => {
            setHomeLoading(true);

            try {
                const result = await fetchHomeContent();

                if (result.success) {
                    setHomeContent(result.data);
                } else {
                    console.error("Failed to fetch home content:", result.message);
                }
            } catch (error) {
                console.error("Failed to fetch home content:", error);
            } finally {
                setHomeLoading(false);
            }
        };

        loadHomeContent();
    }, []);

    // =========================
    // CONTACT FORM SUBMIT
    // =========================

    const handleSubmit = async () => {
        setStatus("");

        const dataToValidate = {
            ...formData,
            phone: formData.phone.replace(/\s/g, ""),
        };

        const result = contactSchema.safeParse(dataToValidate);

        if (!result.success) {
            const firstError = result.error.issues[0];

            setStatus(firstError.message);
            return;
        }

        setLoading(true);

        try {
            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                {
                    firstName: result.data.firstName,
                    lastName: result.data.lastName,
                    to_email: result.data.to_email,
                    phone: result.data.phone,
                    message: result.data.message,
                },
                {
                    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
                }
            );

            setStatus("Email sent successfully!");

            setFormData({
                firstName: "",
                lastName: "",
                to_email: "",
                phone: "",
                message: "",
            });

        } catch (error) {
            console.error("EmailJS error:", error);
            setStatus("Failed to send email.");
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // LOADING STATE
    // =========================

    if (homeLoading) {
        return (
            <div className="min-h-screen flex-center">
                <p className="text-gray-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <TopBar />

            {/* =====================================================
                HERO SECTION
            ====================================================== */}

            <section className="grid lg:grid-cols-2 gap-16 bg-linear-to-b from-transparent to-emerald-100 px-4 md:px-[10vw] py-20">

                {/* Hero Content */}

                <div className="max-lg:order-2 flex-center">
                    <div className="w-[75%]">

                        <p className="text-4xl font-semibold mb-4">
                            {homeContent?.heroSection?.title}
                        </p>

                        <p className="text-sm mb-4">
                            {homeContent?.heroSection?.subTitle}
                        </p>

                        <Link to="/jobposting">
                            <button className="btn rounded-full bg-emerald-500 text-white shadow-none border-none">
                                {homeContent?.heroSection?.button}
                            </button>
                        </Link>

                    </div>
                </div>

                {/* Hero Images */}

                <div className="max-lg:justify-center max-lg:order-1 flex gap-4">

                    {/* Image 1 */}

                    <div className="mb-12 relative w-fit rounded-3xl overflow-hidden">

                        <div
                            className="rounded-3xl bg-linear-to-b from-emerald-500 to-transparent
                            absolute h-[75%] bottom-0 w-full z-0"
                        />

                        {homeContent?.heroSection?.image1 && (
                            <img
                                src={homeContent.heroSection.image1}
                                alt="Hero"
                                className="aspect-3/4 w-[20vw] object-cover relative z-10"
                            />
                        )}

                    </div>

                    {/* Image 2 */}

                    <div className="mt-12 relative w-fit rounded-3xl overflow-hidden">

                        <div
                            className="rounded-3xl bg-linear-to-b from-emerald-500 to-transparent
                            absolute h-[75%] bottom-0 w-full z-0"
                        />

                        {homeContent?.heroSection?.image2 && (
                            <img
                                src={homeContent.heroSection.image2}
                                alt="Hero"
                                className="aspect-3/4 w-[20vw] object-cover relative z-10"
                            />
                        )}

                    </div>

                </div>

            </section>

            {/* =====================================================
                HOW IT WORKS SECTION
            ====================================================== */}

            <section className="grid lg:grid-cols-2 gap-16 px-4 md:px-[10vw] py-20">

                {/* Content */}

                <div>

                    <p className="text-4xl font-semibold mb-16 capitalize">
                        {homeContent?.howItWorksSection?.title}
                    </p>

                    <p className="mb-4 font-semibold capitalize">
                        how it works
                    </p>

                    <div className="space-y-4">

                        {homeContent?.howItWorksSection?.steps?.length > 0 ? (

                            homeContent.howItWorksSection.steps.map(
                                (step, index) => (

                                    <div
                                        key={step.id}
                                        className="flex gap-4 bg-gray-100 rounded-xl p-4"
                                    >

                                        {/* Step Number */}

                                        <div className="flex-center h-10 aspect-square rounded-full bg-emerald-500 text-white font-semibold">

                                            {String(index + 1).padStart(2, "0")}

                                        </div>

                                        {/* Step Content */}

                                        <div>

                                            <p className="font-semibold text-lg capitalize mb-4">
                                                {step?.title}
                                            </p>

                                            <p className="capitalize text-gray-500">
                                                {step?.subTitle}
                                            </p>

                                        </div>

                                    </div>

                                )
                            )

                        ) : (

                            <p className="text-gray-500">
                                No steps available.
                            </p>

                        )}

                    </div>

                </div>

                {/* How It Works Image */}

                <div className="max-h-screen max-lg:hidden">

                    {homeContent?.howItWorksSection?.image && (
                        <img
                            src={homeContent.howItWorksSection.image}
                            alt="How it works"
                            className="rounded-xl h-full object-cover"
                        />
                    )}

                </div>

            </section>

            {/* =====================================================
                CONTACT SECTION
            ====================================================== */}

            <section className="px-4 md:px-[10vw] min-h-screen pb-20">

                {/* Contact Banner */}

                <div className="relative grid sm:grid-cols-2 overflow-hidden bg-emerald-500 text-white py-24 mb-16 px-8 rounded-xl">

                    {homeContent?.contactSection?.image && (
                        <img
                            src={homeContent.contactSection.image}
                            alt="Contact"
                            className="absolute top-0 bottom-0 right-0 left-1/2 w-1/2 h-full object-cover max-sm:hidden"
                            style={{
                                maskImage:
                                    "linear-gradient(to left, black 60%, transparent 100%)",
                                WebkitMaskImage:
                                    "linear-gradient(to left, black 60%, transparent 100%)",
                            }}
                        />
                    )}

                    <div className="max-sm:flex flex-col justify-center items-center">

                        <p className="text-4xl font-semibold mb-4 capitalize">
                            {homeContent?.contactSection?.title}
                        </p>

                        <p className="text-sm">
                            {homeContent?.contactSection?.subTitle}
                        </p>

                    </div>

                </div>

                {/* Contact Content */}

                <div className="grid lg:grid-cols-2 gap-16">

                    {/* Contact Form */}

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
                                <p
                                    className={`text-sm ${status.includes("success")
                                            ? "text-emerald-600"
                                            : "text-red-500"
                                        }`}
                                >
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
                                {loading
                                    ? "Sending..."
                                    : "Send Message"}
                            </button>

                        </div>

                    </div>

                    {/* Contact Details */}

                    <div className="space-y-8">

                        {/* Email */}

                        <div className="flex gap-4">

                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <Mail />
                            </div>

                            <div>

                                <p>
                                    Quick Contact
                                </p>

                                <p className="text-sm">
                                    Email:{" "}
                                    {homeContent?.contactSection?.details?.email}
                                </p>

                            </div>

                        </div>

                        {/* Phone */}

                        <div className="flex gap-4">

                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <Phone />
                            </div>

                            <div>

                                <p>
                                    Phone Number
                                </p>

                                <p className="text-sm">
                                    PH 63 +{" "}
                                    {homeContent?.contactSection?.details?.phone}
                                </p>

                            </div>

                        </div>

                        {/* Location */}

                        <div className="flex gap-4">

                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                                <MapPin />
                            </div>

                            <div>

                                <p>
                                    Location
                                </p>

                                <p className="text-sm">
                                    {homeContent?.contactSection?.details?.location}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}