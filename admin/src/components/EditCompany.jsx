import { MapPin } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { industries } from "../utils/data";
import {
    fetchOneCompany,
    updateCompany
} from "../services/companyServices";
import Input from "./ui/Input";
import Select from "./ui/Select";
import ErrorMessage from "./ui/ErrorMessage";
import {
    Modal,
    ModalBackground,
    ModalFooter,
    ModalHeader
} from "./ui/ui-modal";
import LocationPicker from "./LocationPicker";
import { getAddressFromCoords } from "../utils/tools";
import Loading from "./Loading";

export default function EditCompany({
    companyId,
    onClose = () => { },
    loadAfter = () => { }
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        location: "",
        latitude: null,
        longitude: null,
    });

    const [original, setOriginal] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ validation
    const isValid =
        formData.companyName &&
        formData.industry &&
        formData.location;

    // ✅ detect changes
    const hasChanges = useMemo(() => {
        if (!original) return false;

        return (
            original.companyName !== formData.companyName ||
            original.industry !== formData.industry ||
            original.location !== formData.location ||
            original.latitude !== formData.latitude ||
            original.longitude !== formData.longitude
        );
    }, [formData, original]);

    const handleSubmit = async () => {
        try {

            setIsSubmitting(true);

            const { success, message } = await updateCompany(
                companyId,
                formData
            );

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

    // 🔥 load company
    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);

                const { success, message, company } =
                    await fetchOneCompany(companyId);

                if (success) {
                    setFormData(company);
                    setOriginal(company);
                } else {
                    toast.error(message);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [companyId]);

    // 🔥 reverse geocode
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
                        title="Edit Company"
                        subTitle="Update company information"
                        onClose={onClose}
                    />
                </div>

                {/* LOADING */}
                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loading />
                    </div>
                ) : (
                    <>
                        {/* FORM */}
                        <div className="space-y-5 mb-8">

                            <Input
                                label="Company Name"
                                required
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleInputChange}
                            />

                            <Select
                                label="Industry"
                                required
                                name="industry"
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

                                <div className="relative">
                                    <Input
                                        name="location"
                                        value={formData.location}
                                        readOnly
                                        placeholder="Select from map"
                                        className="bg-gray-50 cursor-pointer"
                                    />

                                    <MapPin
                                        size={16}
                                        className="absolute right-3 top-3 text-gray-400"
                                    />
                                </div>

                                <p className="text-xs text-gray-400">
                                    {isDetectingLocation
                                        ? "Detecting address from map..."
                                        : formData.location
                                            ? "Location selected from map"
                                            : "Click on the map to set location"}
                                </p>

                                <div className="border rounded-lg overflow-hidden">
                                    <LocationPicker setFormData={setFormData} />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={
                                isSubmitting ? "Saving..." : "Save Changes"
                            }
                            onClose={onClose}
                            onSubmit={handleSubmit}
                            submitDisabled={
                                !isValid || !hasChanges || isSubmitting
                            }
                        />
                    </>
                )}
            </Modal>
        </ModalBackground>
    );
}