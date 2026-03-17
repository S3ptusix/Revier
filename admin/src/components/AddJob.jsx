import { X } from "lucide-react";
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

export default function AddJob({ onClose = () => { }, loadTable = () => { } }) {

    const [selectCompanies, setSelectCompanies] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, setFormData, handleInputChange } = useForm({
        jobTitle: '',
        companyId: '',
        employmentType: '',
        education: '',
        experience: '',
        description: '',
        responsibilities: [],
        requirements: [],
        benefitsAndPerks: []
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await createJob(formData);
            if (success) {
                loadTable();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        const runFetchAllCompany = async () => {
            const { success, message, companies } = await fetchAllSelectCompany();

            if (success) {
                setSelectCompanies(companies);
            } else {
                console.error(message);
            }
        };
        runFetchAllCompany();
    }, []);


    return (
        <div className="modal-style">
            <div>
                <button className="onClose-btn" onClick={onClose}>
                    <X size={16} />
                </button>
                <p className="text-lg font-semibold">Post New Job</p>
                <p className="text-sm text-gray-500 mb-8">
                    Create a new job listing
                </p>

                <div className="mb-4">
                    <Input
                        label="Job Title"
                        required={true}
                        name="jobTitle"
                        placeholder="e.g., Senior Software Engineer"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Company"
                        required={true}
                        name="companyId"
                        placeholder="Select Company"
                        value={formData.companyId}
                        options={selectCompanies.map(company => ({ value: company.id, name: company.companyName }))}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Employment Type"
                        required={true}
                        name="employmentType"
                        placeholder="Select Employment Type"
                        value={formData.employmentType}
                        options={employmentTypes}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Education"
                        required={true}
                        name="education"
                        placeholder="e.g., Bachelor's Degree in Information Technology"
                        value={formData.education}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Experience"
                        required={true}
                        name="experience"
                        placeholder="e.g., 3 years of experience in software development"
                        value={formData.experience}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Textarea
                        label="Job Description"
                        required={true}
                        name="description"
                        placeholder="Describe the role, responsibilities, and requirements..."
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <TagInput
                        label="Responsibilities"
                        setValue={(value) => setFormData({ ...formData, responsibilities: value })}
                        placeholder="e.g., Design and develop software features"
                        value={formData.responsibilities}
                    />
                </div>

                <div className="mb-4">
                    <TagInput
                        label="Requirements"
                        setValue={(value) => setFormData({ ...formData, requirements: value })}
                        placeholder="e.g., Bachelor's Degree in Computer Science"
                        value={formData.requirements}
                    />
                </div>

                <div className="mb-8">
                    <TagInput
                        label="Benefits & Perks"
                        setValue={(value) => setFormData({ ...formData, benefitsAndPerks: value })}
                        placeholder="e.g., Health Insurance, Flexible Hours"
                        value={formData.benefitsAndPerks}
                    />
                </div>

                {errorMessage &&
                    <div className="mb-8">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }


                <div className="flex gap-4">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="grow btn bg-emerald-500 text-white"
                        onClick={handleSubmit}
                    >
                        Post Job
                    </button>
                </div>
            </div>
        </div>
    );
}
