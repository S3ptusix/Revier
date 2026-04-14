/* eslint-disable react-hooks/exhaustive-deps */
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import { createCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import LocationPicker from "./LocationPicker";
import { useEffect } from "react";
import { getAddressFromCoords } from "../utils/tools";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";

export default function AddCompany({ onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const { formData, setFormData, handleInputChange } = useForm({
        companyName: '',
        industry: '',
        location: '',
        latitude: null,
        longitude: null,
    });

    const handleSubmit = async () => {
        try {
            const { success, message } = await createCompany(formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
    };

    useEffect(() => {
        const fetchTranslatedAddress = async () => {
            if (formData.latitude && formData.longitude) {
                const translatedAddress = await getAddressFromCoords(formData.latitude, formData.longitude);
                setFormData(prev => ({
                    ...prev,
                    location: translatedAddress
                }));
            }
        };
        fetchTranslatedAddress();
    }, [formData.latitude, formData.longitude]);

    return (
        <ModalBackground>
            <Modal maxWidth={800}>

                <div className="mb-4">
                    <ModalHeader
                        title="Add New Company"
                        subTitle="Enter company details to add to the system"
                        onClose={onClose}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        label="Company Name"
                        required={true}
                        name="companyName"
                        placeholder="Enter company name"
                        value={formData?.companyName}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-4">
                    <Select
                        label="Industry"
                        required={true}
                        name="industry"
                        placeholder="Select Industry"
                        options={industries.map(industry => ({ value: industry.value, name: industry.name }))}
                        value={formData?.industry}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="mb-8 space-y-4">
                    <Input
                        label="Location"
                        required={true}
                        disabled={true}
                        name="location"
                        placeholder="City, Province"
                        value={formData?.location}
                        onChange={handleInputChange}
                    />

                    <LocationPicker setFormData={setFormData} />
                </div>

                {errorMessage &&
                    <div className="mb-8">
                        <ErrorMessage>{errorMessage}</ErrorMessage>
                    </div>
                }

                <ModalFooter
                    cancelLabel={'Cancel'}
                    submitLabel={'Add Company'}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </ModalBackground>
    );
}
