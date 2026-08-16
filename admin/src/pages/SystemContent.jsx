import { useEffect, useState } from "react";
import { Eye, EyeOff, ImagePlus, Mail, MapPin, Phone, Plus, Trash2 } from "lucide-react";
import SideMenu from "../components/SideMenu";
import Loading from "../components/Loading";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import {
    fetchHomeContent,
    updateHeroSection as updateHeroSectionRequest,
    updateHowItWorksSection as updateHowItWorksSectionRequest,
    updateHowItWorksSteps as updateHowItWorksStepsRequest,
    updateContactSection as updateContactSectionRequest,
    uploadHomeImage
} from "../services/systemContentHomeServices";

export default function SystemContent() {

    const [isLoading, setIsLoading] = useState(true);

    // ---------- Load homepage content ----------
    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);

            const result = await fetchHomeContent();

            if (result.success) {
                const { heroSection, howItWorksSection, contactSection } = result.data;

                setHero((prev) => ({
                    ...prev,
                    title: heroSection.title || "",
                    subTitle: heroSection.subTitle || "",
                    button: heroSection.button || "",
                    image1: heroSection.image1 || "",
                    image2: heroSection.image2 || "",
                }));

                setHowItWorks((prev) => ({
                    ...prev,
                    title: howItWorksSection.title || "",
                    steps: howItWorksSection.steps?.length
                        ? howItWorksSection.steps.map(({ title, subTitle }) => ({ title, subTitle }))
                        : prev.steps,
                    image: howItWorksSection.image || "",
                }));

                setContact((prev) => ({
                    ...prev,
                    title: contactSection.title || "",
                    subTitle: contactSection.subTitle || "",
                    details: {
                        email: contactSection.details?.email || "",
                        phone: contactSection.details?.phone || "",
                        location: contactSection.details?.location || "",
                    },
                    image: contactSection.image || "",
                }));
            } else {
                console.error(result.message);
            }

            setIsLoading(false);
        };

        loadContent();
    }, []);

    // ---------- Hero ----------
    const [hero, setHero] = useState({
        title: "Land the Job You've Been Looking For",
        subTitle: "Explore tailored opportunities, connect with leading companies, and take the next step in your career with confidence.",
        button: "Browse Jobs",
        image1: '',
        image2: '',
    });
    const [heroSaving, setHeroSaving] = useState(false);
    const [heroStatus, setHeroStatus] = useState("");
    const [showHeroPreview, setShowHeroPreview] = useState(true);

    const handleHeroChange = (e) => {
        const { name, value } = e.target;
        setHero((prev) => ({ ...prev, [name]: value }));
    };

    const handleHeroImageChange = (field, file) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setHero((prev) => ({ ...prev, [field]: previewUrl, [`${field}File`]: file }));
    };

    const handleHeroSave = async () => {
        setHeroSaving(true);
        setHeroStatus("");
        
        try {
            const result = await updateHeroSectionRequest({
                title: hero.title,
                subTitle: hero.subTitle,
                button: hero.button,
            });

            if (!result.success) {
                setHeroStatus(result.message || "Failed to save hero section.");
                return;
            }

            // upload any newly selected images, one field at a time
            if (hero.image1File) {
                const uploaded = await uploadHomeImage("heroImage1", hero.image1File);
                if (uploaded.success) {
                    setHero((prev) => ({ ...prev, image1: uploaded.data.url, image1File: undefined }));
                } else {
                    setHeroStatus(uploaded.message || "Hero saved, but image 1 upload failed.");
                    return;
                }
            }

            if (hero.image2File) {
                const uploaded = await uploadHomeImage("heroImage2", hero.image2File);
                if (uploaded.success) {
                    setHero((prev) => ({ ...prev, image2: uploaded.data.url, image2File: undefined }));
                } else {
                    setHeroStatus(uploaded.message || "Hero saved, but image 2 upload failed.");
                    return;
                }
            }

            setHeroStatus("Hero section saved.");
        } catch (error) {
            console.error(error);
            setHeroStatus("Failed to save hero section.");
        } finally {
            setHeroSaving(false);
        }
    };

    // ---------- How It Works ----------
    const [howItWorks, setHowItWorks] = useState({
        title: "Your future starts with the right opportunity",
        steps: [
            {
                title: "Create your profile",
                subTitle: "Sign up and build your professional profile to showcase your skills and experience.",
            },
            {
                title: "Search & Apply",
                subTitle: "Browse jobs based on your interest, location, and expertise—apply in just one click.",
            },
            {
                title: "Get hired",
                subTitle: "Connect with employers, attend interviews, and land your ideal job.",
            },
        ],
        image: '',
    });
    const [stepsSaving, setStepsSaving] = useState(false);
    const [stepsStatus, setStepsStatus] = useState("");
    const [showStepsPreview, setShowStepsPreview] = useState(true);

    const handleHowItWorksTitleChange = (e) => {
        setHowItWorks((prev) => ({ ...prev, title: e.target.value }));
    };

    const handleStepChange = (index, field, value) => {
        setHowItWorks((prev) => {
            const steps = [...prev.steps];
            steps[index] = { ...steps[index], [field]: value };
            return { ...prev, steps };
        });
    };

    const handleAddStep = () => {
        setHowItWorks((prev) => ({
            ...prev,
            steps: [...prev.steps, { title: "", subTitle: "" }],
        }));
    };

    const handleRemoveStep = (index) => {
        setHowItWorks((prev) => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index),
        }));
    };

    const handleHowItWorksImageChange = (file) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setHowItWorks((prev) => ({ ...prev, image: previewUrl, imageFile: file }));
    };

    const handleHowItWorksSave = async () => {
        setStepsSaving(true);
        setStepsStatus("");
        try {
            const titleResult = await updateHowItWorksSectionRequest({ title: howItWorks.title });

            if (!titleResult.success) {
                setStepsStatus(titleResult.message || "Failed to save How It Works section.");
                return;
            }

            const stepsResult = await updateHowItWorksStepsRequest(
                howItWorks.steps.map(({ title, subTitle }) => ({ title, subTitle }))
            );

            if (!stepsResult.success) {
                setStepsStatus(stepsResult.message || "Failed to save How It Works steps.");
                return;
            }

            if (howItWorks.imageFile) {
                const uploaded = await uploadHomeImage("howItWorksImage", howItWorks.imageFile);
                if (uploaded.success) {
                    setHowItWorks((prev) => ({ ...prev, image: uploaded.data.url, imageFile: undefined }));
                } else {
                    setStepsStatus(uploaded.message || "Section saved, but image upload failed.");
                    return;
                }
            }

            setStepsStatus("How It Works section saved.");
        } catch (error) {
            console.error(error);
            setStepsStatus("Failed to save How It Works section.");
        } finally {
            setStepsSaving(false);
        }
    };

    // ---------- Contact ----------
    const [contact, setContact] = useState({
        title: "Get in Touch",
        subTitle: "Get in touch with us using the enquiry form or contact details below",
        details: {
            email: "revierconsultants@yahoo.com",
            phone: "0921 444 9014",
            location: "3rd floor, S-Drive Center Building, General Malvar St., Brgy. Tubigan, Biñan, Philippines",
        },
        image: '',
    });
    const [contactSaving, setContactSaving] = useState(false);
    const [contactStatus, setContactStatus] = useState("");
    const [showContactPreview, setShowContactPreview] = useState(true);

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContact((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactDetailChange = (e) => {
        const { name, value } = e.target;
        setContact((prev) => ({
            ...prev,
            details: { ...prev.details, [name]: value },
        }));
    };

    const handleContactImageChange = (file) => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setContact((prev) => ({ ...prev, image: previewUrl, imageFile: file }));
    };

    const handleContactSave = async () => {
        setContactSaving(true);
        setContactStatus("");
        try {
            const result = await updateContactSectionRequest({
                title: contact.title,
                subTitle: contact.subTitle,
                email: contact.details.email,
                phone: contact.details.phone,
                location: contact.details.location,
            });

            if (!result.success) {
                setContactStatus(result.message || "Failed to save contact section.");
                return;
            }

            if (contact.imageFile) {
                const uploaded = await uploadHomeImage("contactImage", contact.imageFile);
                if (uploaded.success) {
                    setContact((prev) => ({ ...prev, image: uploaded.data.url, imageFile: undefined }));
                } else {
                    setContactStatus(uploaded.message || "Contact saved, but image upload failed.");
                    return;
                }
            }

            setContactStatus("Contact section saved.");
        } catch (error) {
            console.error(error);
            setContactStatus("Failed to save contact section.");
        } finally {
            setContactSaving(false);
        }
    };

    return (
        <div className="flex h-screen max-w-screen">
            <SideMenu />
            <div className="bg-gray-50 grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8 max-w-4xl mx-auto w-full space-y-8">

                        {/* admin header */}
                        <section>
                            <p className="text-2xl font-semibold text-gray-900">System Content</p>
                            <p className="text-gray-500">Manage the content shown on the public homepage</p>
                        </section>

                        {/* HERO SECTION */}
                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">Hero Section</p>
                                    <p className="text-sm text-gray-500">The first thing visitors see at the top of the homepage.</p>
                                </div>
                                <PreviewToggle
                                    show={showHeroPreview}
                                    onToggle={() => setShowHeroPreview((v) => !v)}
                                />
                            </div>

                            {showHeroPreview && <HeroPreview hero={hero} />}

                            <div className="space-y-4">
                                <Input
                                    label="Title"
                                    name="title"
                                    value={hero.title}
                                    onChange={handleHeroChange}
                                    placeholder="Land the Job You've Been Looking For"
                                />
                                <Textarea
                                    label="Subtitle"
                                    name="subTitle"
                                    value={hero.subTitle}
                                    onChange={handleHeroChange}
                                    placeholder="Short supporting description"
                                />
                                <Input
                                    label="Button Label"
                                    name="button"
                                    value={hero.button}
                                    onChange={handleHeroChange}
                                    placeholder="Browse Jobs"
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <ImageField
                                        label="Image 1"
                                        imageSrc={hero.image1}
                                        onChange={(file) => handleHeroImageChange("image1", file)}
                                    />
                                    <ImageField
                                        label="Image 2"
                                        imageSrc={hero.image2}
                                        onChange={(file) => handleHeroImageChange("image2", file)}
                                    />
                                </div>
                            </div>

                            <SectionFooter
                                status={heroStatus}
                                saving={heroSaving}
                                onSave={handleHeroSave}
                            />
                        </section>

                        {/* HOW IT WORKS SECTION */}
                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">How It Works Section</p>
                                    <p className="text-sm text-gray-500">The step-by-step process shown to visitors.</p>
                                </div>
                                <PreviewToggle
                                    show={showStepsPreview}
                                    onToggle={() => setShowStepsPreview((v) => !v)}
                                />
                            </div>

                            {showStepsPreview && <HowItWorksPreview howItWorks={howItWorks} />}

                            <div className="space-y-4">
                                <Input
                                    label="Section Title"
                                    name="title"
                                    value={howItWorks.title}
                                    onChange={handleHowItWorksTitleChange}
                                    placeholder="Your future starts with the right opportunity"
                                />

                                <ImageField
                                    label="Section Image"
                                    imageSrc={howItWorks.image}
                                    onChange={handleHowItWorksImageChange}
                                />

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-3">Steps</p>
                                    <div className="space-y-4">
                                        {howItWorks.steps.map((step, index) => (
                                            <div
                                                key={index}
                                                className="relative rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                                                        Step {String(index + 1).padStart(2, "0")}
                                                    </p>
                                                    {howItWorks.steps.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveStep(index)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                            aria-label={`Remove step ${index + 1}`}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>

                                                <Input
                                                    label="Step Title"
                                                    value={step.title}
                                                    onChange={(e) => handleStepChange(index, "title", e.target.value)}
                                                    placeholder="Create your profile"
                                                />
                                                <Textarea
                                                    label="Step Description"
                                                    value={step.subTitle}
                                                    onChange={(e) => handleStepChange(index, "subTitle", e.target.value)}
                                                    placeholder="Describe this step"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleAddStep}
                                        className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        <Plus size={16} />
                                        Add Step
                                    </button>
                                </div>
                            </div>

                            <SectionFooter
                                status={stepsStatus}
                                saving={stepsSaving}
                                onSave={handleHowItWorksSave}
                            />
                        </section>

                        {/* CONTACT SECTION */}
                        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">Contact Section</p>
                                    <p className="text-sm text-gray-500">Contact details shown at the bottom of the homepage.</p>
                                </div>
                                <PreviewToggle
                                    show={showContactPreview}
                                    onToggle={() => setShowContactPreview((v) => !v)}
                                />
                            </div>

                            {showContactPreview && <ContactPreview contact={contact} />}

                            <div className="space-y-4">
                                <Input
                                    label="Title"
                                    name="title"
                                    value={contact.title}
                                    onChange={handleContactChange}
                                    placeholder="Get in Touch"
                                />
                                <Textarea
                                    label="Subtitle"
                                    name="subTitle"
                                    value={contact.subTitle}
                                    onChange={handleContactChange}
                                    placeholder="Short supporting description"
                                />

                                <ImageField
                                    label="Banner Image"
                                    imageSrc={contact.image}
                                    onChange={handleContactImageChange}
                                />

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit mt-6">
                                            <Mail size={18} />
                                        </div>
                                        <div className="grow">
                                            <Input
                                                label="Email"
                                                name="email"
                                                value={contact.details.email}
                                                onChange={handleContactDetailChange}
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit mt-6">
                                            <Phone size={18} />
                                        </div>
                                        <div className="grow">
                                            <Input
                                                label="Phone"
                                                name="phone"
                                                value={contact.details.phone}
                                                onChange={handleContactDetailChange}
                                                placeholder="0921 444 9014"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit mt-6">
                                        <MapPin size={18} />
                                    </div>
                                    <div className="grow">
                                        <Textarea
                                            label="Location"
                                            name="location"
                                            value={contact.details.location}
                                            onChange={handleContactDetailChange}
                                            placeholder="Office address"
                                        />
                                    </div>
                                </div>
                            </div>

                            <SectionFooter
                                status={contactStatus}
                                saving={contactSaving}
                                onSave={handleContactSave}
                            />
                        </section>

                    </div>
                )}
            </div>
        </div>
    )
}

function PreviewToggle({ show, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="shrink-0 flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-emerald-600 transition-colors border border-gray-200 hover:border-emerald-300 rounded-full px-3 py-1.5"
        >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
            {show ? "Hide Preview" : "Show Preview"}
        </button>
    );
}

function PreviewFrame({ children }) {
    return (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-2 border-b border-gray-200">
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <p className="ml-2 text-[11px] font-medium text-gray-400 uppercase tracking-wide">Live Preview</p>
            </div>
            <div className="bg-white overflow-hidden">
                {children}
            </div>
        </div>
    );
}

// Mirrors the hero markup from the public Home page, scaled to fit the admin card.
function HeroPreview({ hero }) {
    return (
        <PreviewFrame>
            <div className="grid sm:grid-cols-2 gap-6 items-center bg-linear-to-b from-transparent to-emerald-100 px-5 sm:px-8 py-8">
                <div className="max-sm:order-2">
                    <p className="text-xl sm:text-2xl font-semibold mb-2 line-clamp-3">
                        {hero.title || "Hero title"}
                    </p>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                        {hero.subTitle || "Hero subtitle"}
                    </p>
                    <button
                        type="button"
                        className="btn btn-sm rounded-full bg-emerald-500 text-white shadow-none border-none pointer-events-none"
                    >
                        {hero.button || "Button label"}
                    </button>
                </div>
                <div className="max-sm:order-1 flex justify-center gap-3">
                    <div className="relative w-20 sm:w-24 rounded-2xl overflow-hidden mb-6">
                        <div className="rounded-2xl bg-linear-to-b from-emerald-500 to-transparent absolute h-[75%] bottom-0 w-full z-0" />
                        {hero.image1 ? (
                            <img src={hero.image1} alt="Preview image 1" className="aspect-3/4 w-full object-cover relative z-10" />
                        ) : (
                            <div className="aspect-3/4 w-full bg-gray-100" />
                        )}
                    </div>
                    <div className="relative w-20 sm:w-24 rounded-2xl overflow-hidden mt-6">
                        <div className="rounded-2xl bg-linear-to-b from-emerald-500 to-transparent absolute h-[75%] bottom-0 w-full z-0" />
                        {hero.image2 ? (
                            <img src={hero.image2} alt="Preview image 2" className="aspect-3/4 w-full object-cover relative z-10" />
                        ) : (
                            <div className="aspect-3/4 w-full bg-gray-100" />
                        )}
                    </div>
                </div>
            </div>
        </PreviewFrame>
    );
}

// Mirrors the "How It Works" markup from the public Home page, scaled to fit the admin card.
function HowItWorksPreview({ howItWorks }) {
    return (
        <PreviewFrame>
            <div className="grid sm:grid-cols-2 gap-6 px-5 sm:px-8 py-8">
                <div>
                    <p className="text-lg sm:text-xl font-semibold mb-4 capitalize line-clamp-2">
                        {howItWorks.title || "Section title"}
                    </p>
                    <div className="space-y-2.5">
                        {howItWorks.steps.map((step, index) => (
                            <div key={index} className="flex gap-3 bg-gray-100 rounded-lg p-3">
                                <div className="flex-center h-7 aspect-square shrink-0 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <div>
                                    <p className="font-semibold text-xs capitalize mb-0.5">
                                        {step?.title || `Step ${index + 1}`}
                                    </p>
                                    <p className="capitalize text-gray-500 text-[11px] line-clamp-2">
                                        {step?.subTitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="max-sm:hidden rounded-xl overflow-hidden">
                    {howItWorks.image ? (
                        <img src={howItWorks.image} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-gray-100" />
                    )}
                </div>
            </div>
        </PreviewFrame>
    );
}

// Mirrors the contact banner + details markup from the public Home page, scaled to fit the admin card.
function ContactPreview({ contact }) {
    return (
        <PreviewFrame>
            <div className="p-5 sm:p-8 space-y-6">
                <div className="relative grid sm:grid-cols-2 overflow-hidden bg-emerald-500 text-white py-8 px-6 rounded-xl">
                    {contact.image && (
                        <img
                            src={contact.image}
                            alt="Banner preview"
                            className="absolute top-0 bottom-0 right-0 left-1/2 w-1/2 h-full object-cover max-sm:hidden"
                            style={{
                                maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
                                WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)",
                            }}
                        />
                    )}
                    <div className="relative max-sm:flex flex-col justify-center items-center text-center sm:text-left sm:items-start">
                        <p className="text-lg sm:text-xl font-semibold mb-1.5 capitalize">
                            {contact.title || "Contact title"}
                        </p>
                        <p className="text-xs text-emerald-50 line-clamp-2">
                            {contact.subTitle || "Contact subtitle"}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                            <Mail size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Quick Contact</p>
                            <p className="text-xs text-gray-500">{contact.details.email || "Email address"}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                            <Phone size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Phone Number</p>
                            <p className="text-xs text-gray-500">PH +63 {contact.details.phone || "Phone number"}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 h-fit w-fit">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-medium">Location</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{contact.details.location || "Office address"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </PreviewFrame>
    );
}

function ImageField({ label, imageSrc, onChange }) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
            <label className="group relative flex items-center gap-4 rounded-xl border border-dashed border-gray-300 hover:border-emerald-400 transition-colors p-3 cursor-pointer bg-gray-50">
                <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    {imageSrc ? (
                        <img src={imageSrc} alt={label} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImagePlus size={20} />
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm font-medium text-emerald-600 group-hover:text-emerald-700">
                        Change image
                    </p>
                    <p className="text-xs text-gray-400">PNG or JPG, up to 5MB</p>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onChange(e.target.files?.[0])}
                />
            </label>
        </div>
    );
}

function SectionFooter({ status, saving, onSave }) {
    return (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className={`text-sm ${status.includes("Failed") ? "text-red-500" : "text-emerald-600"}`}>
                {status}
            </p>
            <button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="btn rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors text-white shadow-none border-none px-6 disabled:opacity-60"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
