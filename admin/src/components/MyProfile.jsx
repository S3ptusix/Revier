import { useContext, useState, useMemo } from 'react';
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from './ui/Input';
import { UserContext } from '../context/AuthProvider';
import { editProfile } from '../services/adminServices';
import { toast } from "react-toastify";
import { useForm } from '../hooks/form';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../services/authServices';
import Loading from './Loading';

export default function MyProfile({ onClose = () => { } }) {
    const navigate = useNavigate();
    const { admin, setAdmin } = useContext(UserContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReStarting, setIsReStarting] = useState(false);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);

    const { formData, handleInputChange } = useForm({
        firstName: admin?.firstName,
        lastName: admin?.lastName,
    });

    // ✅ detect if changes were made
    const hasChanges = useMemo(() => {
        return (
            formData.firstName !== admin?.firstName ||
            formData.lastName !== admin?.lastName
        );
    }, [formData, admin]);

    const handleEditProfile = async () => {
        if (!hasChanges) {
            return toast.info("No changes to save");
        }

        // confirm before logout-triggering action
        setShowConfirmLogout(true);
    };

    const confirmSave = async () => {
        try {
            setIsSubmitting(true);

            const { success, message } = await editProfile(formData);

            if (success) {
                toast.success("Profile updated. Restarting session...");
                setShowConfirmLogout(false);
                setIsReStarting(true);

                setTimeout(async () => {
                    await logoutAdmin();
                    setAdmin(null);
                    navigate('/login');
                }, 2000);

                return;
            }

            toast.error(message);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* MAIN MODAL */}
            <ModalBackground>
                <Modal maxWidth={500}>
                    <section className='space-y-6'>
                        <ModalHeader
                            title="My Profile"
                            subTitle="Update your personal information"
                            onClose={onClose}
                        />

                        <Input
                            name='firstName'
                            label='First name'
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />

                        <Input
                            name='lastName'
                            label='Last name'
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-4">
                            <button
                                className={`btn rounded-xl text-white 
                                    ${hasChanges
                                        ? "bg-emerald-500"
                                        : "bg-gray-300 cursor-not-allowed"
                                    }`}
                                disabled={!hasChanges || isSubmitting}
                                onClick={handleEditProfile}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </section>
                </Modal>
            </ModalBackground>

            {/* CONFIRMATION MODAL */}
            {showConfirmLogout && (
                <ModalBackground>
                    <Modal>
                        <ModalHeader
                            title="Confirm Changes"
                            subTitle="You will be logged out to apply changes"
                            onClose={() => setShowConfirmLogout(false)}
                        />

                        <p className="text-sm text-gray-600 mb-6">
                            Saving profile changes requires restarting your session.
                            Do you want to continue?
                        </p>

                        <ModalFooter
                            cancelLabel="Cancel"
                            submitLabel={isSubmitting ? "Saving..." : "Yes, Continue"}
                            onClose={() => setShowConfirmLogout(false)}
                            onSubmit={confirmSave}
                        />
                    </Modal>
                </ModalBackground>
            )}

            {/* RESTART LOADING */}
            {isReStarting && (
                <ModalBackground>
                    <Modal>
                        <div className="text-center space-y-4">
                            <p className="text-sm text-gray-600">
                                Applying changes...
                            </p>
                            <Loading />
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}