import { useContext, useState, useMemo } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
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

                        <div className='space-y-4'>
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
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end items-center gap-3 pt-2 border-t border-gray-100">
                            <button
                                className='btn rounded-xl text-gray-600 hover:bg-gray-100'
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                className={`btn rounded-xl text-white transition-colors
                                    ${hasChanges
                                        ? "bg-emerald-500 hover:bg-emerald-600"
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
                        <div className='space-y-4'>
                            <ModalHeader
                                title="Confirm Changes"
                                subTitle="You will be logged out to apply changes"
                                onClose={() => setShowConfirmLogout(false)}
                            />

                            <div className='flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3'>
                                <AlertTriangle size={18} className='text-amber-500 shrink-0 mt-0.5' />
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    Saving profile changes requires restarting your session.
                                    Do you want to continue?
                                </p>
                            </div>
                        </div>

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
                        <div className="text-center space-y-4 py-4">
                            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50'>
                                <Check size={22} className='text-emerald-500' />
                            </div>
                            <div>
                                <p className='font-semibold text-gray-900'>Profile updated</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Restarting your session...
                                </p>
                            </div>
                            <Loading />
                        </div>
                    </Modal>
                </ModalBackground>
            )}
        </>
    );
}