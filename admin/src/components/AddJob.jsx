import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fetchAllCompany } from "../services/companyServices";
import { employmentTypes } from "../utils/data";
import { createJob } from "../services/jobServices";
import TagInput from "./ui/TagInput";
import ErrorMessage from "./ui/ErrorMessage";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";
import Select from "./ui/Select";

export default function AddJob({ onClose }) {

    const [selectCompanies, setSelectCompanies] = useState([]);

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { success, message } = await createJob(formData);
            if (success) {
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
            const { success, message, companies } = await fetchAllCompany();

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
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Company"
                        required={true}
                        name="companyId"
                        placeholder="Select Company"
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
                        options={employmentTypes.map(type => ({ value: type, name: type }))}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Education"
                        required={true}
                        name="education"
                        placeholder="e.g., Bachelor's Degree in Information Technology"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Experience"
                        required={true}
                        name="experience"
                        placeholder="e.g., 3 years of experience in software development"
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Textarea
                        label="Job Description"
                        required={true}
                        name="description"
                        placeholder="Describe the role, responsibilities, and requirements..."
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <TagInput
                        label="Responsibilities"
                        value={formData.responsibilities}
                        setValue={(value) => setFormData({ ...formData, responsibilities: value })}
                        placeholder="e.g., Design and develop software features"
                    />
                </div>

                <div className="mb-4">
                    <TagInput
                        label="Requirements"
                        value={formData.requirements}
                        setValue={(value) => setFormData({ ...formData, requirements: value })}
                        placeholder="e.g., Bachelor's Degree in Computer Science"
                    />
                </div>

                <div className="mb-8">
                    <TagInput
                        label="Benefits & Perks"
                        value={formData.benefitsAndPerks}
                        setValue={(value) => setFormData({ ...formData, benefitsAndPerks: value })}
                        placeholder="e.g., Health Insurance, Flexible Hours"
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
