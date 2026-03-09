import { ArrowLeft, Award, Bookmark, Briefcase, Building2, CircleCheckBig, Clock, GraduationCap, MapPin } from "lucide-react";
import { formatPostedDate } from "../utils/format";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import { useState } from "react";
import Input from "./ui/Input";
import { useForm } from "../hooks/form";

export default function ViewJob({ job, show, onClose = () => { } }) {

    const [showApply, setShowApply] = useState(false);

    const { formData, handleInputChange } = useForm({
        fullname: '',
        phone: '',
        linkedIn: '',
        portfolio: '',
        resume: {},
    });

    const handleSubmit = async () => {
        console.log(formData);
    }

    return (
        <>
            {job ? (
                <div className={`max-lg:fixed max-lg:inset-0 sticky top-0 h-screen bg-white border border-gray-200 rounded-xl p-4 max-lg:z-999 overflow-auto ${show ? 'max-lg:opacity-100' : 'max-lg:opacity-0 max-lg:pointer-events-none'} duration-200`}>
                    <button
                        className="lg:hidden flex items-center gap-2 cursor-pointer mb-8"
                        onClick={onClose}
                    >
                        <ArrowLeft className="text-emerald-500" />
                        <p className="font-semibold">Back to jobs</p>
                    </button>
                    <button className="btn btn-square btn-ghost rounded-lg absolute top-4 right-4">
                        <Bookmark />
                    </button>

                    <div className="flex gap-4 mb-4">
                        <div className="p-4 rounded-lg bg-gray-200 text-gray-500 h-fit w-fit">
                            <Building2 size={32} className="shrink-0" />
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{job?.jobTitle}</p>
                            <p className="text-gray-500 mb-4">{job?.company?.companyName}</p>
                            <div className="flex gap-2">
                                <span className="bg-emerald-100 text-emerald-500 rounded-full px-4 py-1 text-sm">{job?.type}</span>
                                <span className="flex gap-2 items-center text-gray-500 text-sm">
                                    <Clock size={16} /> {formatPostedDate(job?.postedAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 flex-wrap items-center mb-8">
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <MapPin className="text-gray-500 shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs">Location</p>
                                <p className="text-sm font-semibold">{job?.company?.location}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <GraduationCap className="text-gray-500 shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs">Education</p>
                                <p className="text-sm font-semibold">{job?.education}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-2 min-w-50">
                            <Award className="text-gray-500 shrink-0" size={16} />
                            <div>
                                <p className="text-gray-500 text-xs">Experience</p>
                                <p className="text-sm font-semibold">{job?.experience}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xl font-semibold mb-4">Job Description</p>
                    <p className="whitespace-pre-line text-gray-500 mb-8">{job?.description}</p>

                    {(job?.responsibilities?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Responsibilities</p>
                            <div className="flex flex-col gap-2 mb-8">
                                {job?.responsibilities.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    {(job?.requirements?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Requirements</p>
                            <div className="flex flex-col gap-2 mb-8">
                                {job?.requirements.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    {(job?.benefitsAndPerks?.length > 0) &&
                        <>
                            <p className="text-xl font-semibold mb-4">Benefits & Perks</p>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {job?.benefitsAndPerks.map((item, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
                                        <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                                        <p className="text-gray-500">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    }
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            className="btn rounded-lg bg-emerald-500 text-white"
                            onClick={() => setShowApply(true)}
                        >
                            Apply Now
                        </button>
                        <button className="btn roundded-lg">
                            <Bookmark size={16} />
                            Save Job
                        </button>
                    </div>
                </div>
            ) : (
                <div className="max-lg:fixed max-lg:inset-0 sticky top-0 h-screen flex-center flex-col bg-white border border-gray-200 rounded-xl p-4 max-lg:z-999 overflow-auto max-lg:opacity-0 max-lg:pointer-events-none">
                    <Briefcase size={64} className="text-gray-200" />
                    <p className="text-gray-500 text-lg">Select a job to see details</p>
                </div>
            )}

            <ModalBackground show={showApply}>
                <Modal maxWidth={650}>
                    <div className="mb-4">
                        <ModalHeader
                            icon={Briefcase}
                            title="Apply for Position"
                            subTitle={`${job?.jobTitle} at ${job?.company?.companyName}`}
                            onClose={() => setShowApply(false)}
                        />
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Fullname"
                            required={true}
                            type="text"
                            name="fullname"
                            placeholder="Jahleel Casintahan"
                            value={formData?.fullname}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Phone Number"
                            required={true}
                            name="phone"
                            value={formData?.phone}
                            placeholder="+63 91 234 5678"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="LinkedIn Profile (Optional)"
                            type="text"
                            name="linkedIn"
                            placeholder="https://linkedin.com/in/jahleelcasintahan"
                            value={formData.linkedIn}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Portfolio Website (Optional)"
                            type="text"
                            name="portfolio"
                            placeholder="https://johndoe.com"
                            value={formData.portfolio}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Resume"
                            required={true}
                            type="file"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            onChange={handleInputChange}
                        />
                        {formData.resume && (
                            <p className="text-xs text-gray-500 mt-1">
                                Selected file: {formData.resume.name}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-xs text-gray-500">By submitting this application, you agree to our Terms of Service and Privacy Policy. Your information will be shared with Techflow Inc for recruitment purposes.</p>
                    </div>
                    <ModalFooter
                        submitLabel={'Submit Application'}
                        onClose={() => setShowApply(false)}
                        onSubmit={handleSubmit}
                    />
                </Modal>
            </ModalBackground>
        </>
    )
}