/* eslint-disable react-hooks/exhaustive-deps */
import { MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import { createCompany } from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import { useForm } from "../hooks/form";
import LocationPicker from "./LocationPicker";
import { getAddressFromCoords } from "../utils/tools";
import {
    Modal,
    ModalBackground,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";

export default function AddCompany({
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const { formData, setFormData, handleInputChange } = useForm({
        companyName: "",
        industry: "",
        location: "",
        latitude: null,
        longitude: null,
    });

    // ✅ validation
    const isValid =
        formData.companyName &&
        formData.industry &&
        formData.location;

    const handleSubmit = async () => {
        try {

            setIsSubmitting(true);

            const { success, message } = await createCompany(formData);

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

    // 🔥 reverse geocode (map → address)
    useEffect(() => {
        const fetchAddress = async () => {
            if (formData.latitude && formData.longitude) {
                try {
                    setIsDetectingLocation(true);

                    const address = await getAddressFromCoords(
                        formData.latitude,
                        formData.longitude
                    );

                    setFormData(prev => ({
                        ...prev,
                        location: address
                    }));
                } catch (error) {
                    console.error(error);
                    toast.error("Something went wrong.");
                } finally {
                    setIsDetectingLocation(false);
                }
            }
        };

        fetchAddress();
    }, [formData.latitude, formData.longitude]);

    return (
        <ModalBackground>
            <Modal maxWidth={700}>

                {/* HEADER */}
                <div className="mb-6">
                    <ModalHeader
                        title="Add Company"
                        subTitle="Fill in company details"
                        onClose={onClose}
                    />
                </div>

                {/* FORM */}
                <div className="space-y-5 mb-8">

                    {/* COMPANY NAME */}
                    <Input
                        label="Company Name"
                        required
                        name="companyName"
                        placeholder="e.g. ABC Corporation"
                        value={formData.companyName}
                        onChange={handleInputChange}
                    />

                    {/* INDUSTRY */}
                    <Select
                        label="Industry"
                        required
                        name="industry"
                        placeholder="Select Industry"
                        options={industries.map(i => ({
                            value: i.value,
                            name: i.name
                        }))}
                        value={formData.industry}
                        onChange={handleInputChange}
                    />

                    {/* LOCATION */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Location <span className="text-red-500">*</span>
                        </label>

                        {/* READ ONLY DISPLAY */}
                        <div className="relative">
                            <Input
                                name="location"
                                value={formData.location}
                                readOnly
                                placeholder="Select location from map"
                                className="bg-gray-50 cursor-pointer"
                            />

                            <MapPin
                                size={16}
                                className="absolute right-3 top-3 text-gray-400"
                            />
                        </div>

                        {/* HELPER TEXT */}
                        <p className="text-xs text-gray-400">
                            {isDetectingLocation
                                ? "Detecting address from map..."
                                : formData.location
                                    ? "Location selected from map"
                                    : "Click on the map to set location"}
                        </p>

                        {/* MAP */}
                        <div className="border rounded-lg overflow-hidden">
                            <LocationPicker setFormData={setFormData} />
                        </div>
                    </div>
                </div>

                {/* FOOTER */}
                <ModalFooter
                    cancelLabel="Cancel"
                    submitLabel={isSubmitting ? "Adding..." : "Add Company"}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                    disableSubmit={!isValid || isSubmitting}
                />
            </Modal>
        </ModalBackground>
    );
}