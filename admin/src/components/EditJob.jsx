import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { fetchAllSelectCompany } from "../services/companyServices";
import { employmentTypes } from "../utils/data";
import TagInput from "./ui/TagInput";
import ErrorMessage from "./ui/ErrorMessage";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";
import Input from "./ui/Input";
import { editJob, fetchOneJob } from "../services/jobServices";
import {
    Modal,
    ModalBackground,
    ModalHeader,
    ModalFooter,
    ModalBody
} from "./ui/ui-modal";
import Loading from "./Loading";

export default function EditJob({
    jobId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [selectCompanies, setSelectCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({});
    const [original, setOriginal] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    // ✅ CHANGE DETECTION
    const hasChanges = useMemo(() => {
        if (!original) return false;
        return JSON.stringify(formData) !== JSON.stringify(original);
    }, [formData, original]);

    const handleSubmit = async () => {
        try {

            setIsSubmitting(true);

            const { success, message } = await editJob(jobId, formData);

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

    // 🔥 LOAD DATA
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);

                const [companiesRes, jobRes] = await Promise.all([
                    fetchAllSelectCompany(),
                    fetchOneJob(jobId)
                ]);

                if (companiesRes.success) {
                    setSelectCompanies(companiesRes.companies);
                }

                if (jobRes.success) {
                    const job = jobRes.job;

                    const formatted = {
                        jobTitle: job.jobTitle,
                        companyId: job.companyId,
                        slot: job.slot,
                        employmentType: job.type,
                        education: job.education,
                        experience: job.experience,
                        description: job.description,
                        payType: job.payType,
                        payMin: job.payMin,
                        payMax: job.payMax,
                        responsibilities: job.responsibilities || [],
                        requirements: job.requirements || [],
                        benefitsAndPerks: job.benefitsAndPerks || []
                    };

                    setFormData(formatted);
                    setOriginal(formatted);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [jobId]);

    return (
        <ModalBackground>
            <Modal maxWidth={700}>

                <ModalHeader
                    title="Edit Job"
                    subTitle="Update job listing details"
                    onClose={onClose}
                />
                {/* LOADING */}
                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {/* BODY */}
                        <ModalBody>

                            <Input
                                label="Job Title"
                                required
                                name="jobTitle"
                                value={formData.jobTitle || ""}
                                onChange={handleInputChange}
                            />

                            <Select
                                label="Company"
                                required
                                name="companyId"
                                value={formData.companyId || ""}
                                options={selectCompanies.map(c => ({
                                    value: c.id,
                                    name: c.companyName
                                }))}
                                onChange={handleInputChange}
                            />

                            <Input
                                label="Slots"
                                type="number"
                                min={1}
                                name="slot"
                                value={formData.slot || ""}
                                onChange={handleInputChange}
                            />

                            <Select
                                label="Employment Type"
                                name="employmentType"
                                value={formData.employmentType || ""}
                                options={employmentTypes}
                                onChange={handleInputChange}
                            />

                            <Textarea
                                label="Job Description"
                                name="description"
                                value={formData.description || ""}
                                onChange={handleInputChange}
                            />

                            {/* SALARY */}
                            <div className="space-y-4 border border-gray-300 rounded-xl p-4">
                                <p className="text-sm font-semibold text-gray-600">
                                    Salary
                                </p>

                                <Select
                                    label="Pay Type"
                                    name="payType"
                                    value={formData.payType || ""}
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
                                        name="payMin"
                                        value={formData.payMin || ""}
                                        onChange={handleInputChange}
                                    />
                                    <Input
                                        label="Maximum"
                                        type="number"
                                        name="payMax"
                                        value={formData.payMax || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* TAGS */}
                            <TagInput
                                label="Responsibilities"
                                value={formData.responsibilities || []}
                                setValue={(v) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        responsibilities: v
                                    }))
                                }
                            />

                            <TagInput
                                label="Requirements"
                                value={formData.requirements || []}
                                setValue={(v) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        requirements: v
                                    }))
                                }
                            />

                            <TagInput
                                label="Benefits & Perks"
                                value={formData.benefitsAndPerks || []}
                                setValue={(v) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        benefitsAndPerks: v
                                    }))
                                }
                            />
                        </ModalBody>

                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={
                                isSubmitting ? "Saving..." : "Save Changes"
                            }
                            onClose={onClose}
                            onSubmit={handleSubmit}
                            submitDisabled={
                                !hasChanges || isSubmitting
                            }
                        />
                    </>
                )}

            </Modal>
        </ModalBackground>
    );
}