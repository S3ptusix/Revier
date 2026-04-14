import { useState } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import { fetchOneCompany, updateCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useEffect } from "react";
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import LocationPicker from "./LocationPicker";
import { getAddressFromCoords } from "../utils/tools";

export default function EditCompany({ companyId, onClose = () => { }, loadAfter = () => { } }) {

    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        location: '',
        longtitude: null,
        latitude: null,
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
            const { success, message } = await updateCompany(companyId, formData);
            if (success) {
                loadAfter();
                onClose();
                return toast.success(message, { toastId: 'success-submit' });
            }
            setErrorMessage(message);
        } catch (error) {
            console.error('Error on handleSubmit:', error)
        }
        console.log(formData);
    };

    useEffect(() => {
        try {
            const loadData = async () => {
                const { success, message, company } = await fetchOneCompany(companyId);
                if (success) return setFormData(company);
                setErrorMessage(message);
            }
            loadData();
        } catch (error) {
            console.error(error);
        }
    }, [companyId]);

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
                        title="Edit Company"
                        subTitle="Update company information"
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
                    submitLabel={'Save Changes'}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />
            </Modal>
        </ModalBackground>
    );
}
