import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllSelectCompany } from "../services/companyServices";
import { employmentTypes } from "../utils/data";
import { createJob } from "../services/jobServices";
import TagInput from "./ui/TagInput";
import ErrorMessage from "./ui/ErrorMessage";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import Input from "./ui/Input";
import { useForm } from "../hooks/form";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter
} from "./ui/ui-modal";
import Loading from "./Loading";

export default function AddJob({
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [selectCompanies, setSelectCompanies] = useState([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        jobTitle: "",
        companyId: "",
        slot: "",
        employmentType: "",
        education: "",
        experience: "",
        description: "",
        payType: "",
        payMin: "",
        payMax: "",
        responsibilities: [],
        requirements: [],
        benefitsAndPerks: []
    });

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await createJob(formData);

            if (success) {
                toast.success(message, { toastId: "success-submit" });
                loadAfter();
                onClose();
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 🔥 LOAD COMPANIES
    useEffect(() => {
        const loadCompanies = async () => {
            try {
                setIsLoadingCompanies(true);

                const { success, message, companies } = await fetchAllSelectCompany();
                if (success) setSelectCompanies(companies);
                else toast.error(message);
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong.");
            } finally {
                setIsLoadingCompanies(false);
            }
        };

        loadCompanies();
    }, []);

    return (
        <ModalBackground>
            <Modal maxWidth={700}>

                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        title="Post New Job"
                        subTitle="Create a job listing"
                        onClose={onClose}
                    />
                </div>

                {/* BODY */}
                <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">

                    {/* BASIC INFO */}
                    <div className="space-y-4">
                        <Input
                            label="Job Title"
                            required
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                        />

                        {isLoadingCompanies ? (
                            <Loading />
                        ) : (
                            <Select
                                label="Company"
                                placeholder="Select Company"
                                required
                                name="companyId"
                                value={formData.companyId}
                                options={selectCompanies.map(c => ({
                                    value: c.id,
                                    name: c.companyName
                                }))}
                                onChange={handleInputChange}
                            />
                        )}

                        <Input
                            label="Slots"
                            type="number"
                            min={1}
                            required
                            name="slot"
                            value={formData.slot}
                            onChange={handleInputChange}
                        />

                        <Select
                            label="Employment Type"
                            placeholder="Select Employment type"
                            required
                            name="employmentType"
                            value={formData.employmentType}
                            options={employmentTypes}
                            onChange={handleInputChange}
                        />
                    </div>

                    <Input
                        label="Education"
                        name="education"
                        required
                        value={formData.education}
                        onChange={handleInputChange}
                    />

                    <Input
                        label="Experience"
                        name="experience"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                    />

                    {/* DESCRIPTION */}
                    <Textarea
                        label="Job Description"
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />

                    {/* SALARY */}
                    <div className="space-y-4 border border-gray-300 rounded-xl p-4">
                        <p className="text-sm font-semibold text-gray-600">
                            Salary
                        </p>

                        <Select
                            label="Pay Type"
                            placeholder="Select Pay type"
                            name="payType"
                            value={formData.payType}
                            options={[
                                { value: "Monthly", name: "Monthly" },
                                { value: "Weekly", name: "Weekly" },
                                { value: "Hourly", name: "Hourly" }
                            ]}
                            onChange={handleInputChange}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Minimum"
                                type="number"
                                min={0}
                                name="payMin"
                                value={formData.payMin}
                                onChange={handleInputChange}
                            />
                            <Input
                                label="Maximum"
                                type="number"
                                min={0}
                                name="payMax"
                                value={formData.payMax}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {/* TAGS */}
                    <TagInput
                        label="Responsibilities"
                        required
                        value={formData.responsibilities}
                        setValue={(v) =>
                            setFormData(prev => ({
                                ...prev,
                                responsibilities: v
                            }))
                        }
                    />

                    <TagInput
                        label="Requirements"
                        required
                        value={formData.requirements}
                        setValue={(v) =>
                            setFormData(prev => ({
                                ...prev,
                                requirements: v
                            }))
                        }
                    />

                    <TagInput
                        label="Benefits & Perks"
                        required
                        value={formData.benefitsAndPerks}
                        setValue={(v) =>
                            setFormData(prev => ({
                                ...prev,
                                benefitsAndPerks: v
                            }))
                        }
                    />
                </div>

                {/* FOOTER */}
                <div className="mt-6">
                    <ModalFooter
                        cancelLabel="Cancel"
                        submitLabel={
                            isSubmitting ? "Posting..." : "Post Job"
                        }
                        onClose={onClose}
                        onSubmit={handleSubmit}
                        submitDisabled={isSubmitting}
                    />
                </div>

            </Modal>
        </ModalBackground>
    );
}