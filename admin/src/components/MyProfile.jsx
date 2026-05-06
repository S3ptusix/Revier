/* eslint-disable no-unused-vars */
import { ChevronRight, ClipboardClock, Lock, LogOut, User, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalFooter, ModalHeader } from "./ui/ui-modal";
import Input from './ui/Input';
import { useContext, useState } from 'react';
import { UserContext } from '../context/AuthProvider';
import { changePassword, editProfile } from '../services/adminServices';
import { toast } from "react-toastify";
import { useForm } from '../hooks/form';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../services/authServices';
import Loading from './Loading';

export default function MyProfile({ onClose = () => { } }) {

    const [isReStarting, setIsReStarting] = useState(false);

    const navigate = useNavigate();

    const { admin, setAdmin } = useContext(UserContext);

    const { formData, handleInputChange } = useForm({
        firstName: admin?.firstName,
        lastName: admin?.lastName,
    });

    // const { formData, setFormData, handleInputChange } = useForm({
    //     currentPassword: '',
    //     newPassword: '',
    //     confirmNewPassword: '',
    // });

    const handleEditProfile = async () => {
        try {
            const { success, message } = await editProfile(formData);
            if (success) {
                setIsReStarting(true);
                setTimeout(() => {
                    setIsReStarting(false);
                    setAdmin(null);
                    navigate('/');
                }, 2000);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogout = async () => {
        try {
            const { success } = await logoutAdmin();
            if (success) {
                setAdmin(null);
                navigate('/login');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    // const handleChangePassword = async () => {
    //     try {
    //         const { success, message } = await changePassword(formData);
    //         if (success) {
    //             setFormData({
    //                 currentPassword: '',
    //                 newPassword: '',
    //                 confirmNewPassword: '',
    //             });
    //             toast.success(message);
    //             return
    //         };
    //         toast.error(message);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    return (
        <>
            <ModalBackground>
                <Modal>
                    <section className='space-y-8'>
                        <ModalHeader
                            title="My Profile"
                            onClose={onClose}
                        />

                        <Input
                            name={'firstName'}
                            label={'First name'}
                            required={true}
                            placeholder={'John'}
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                        <Input
                            name={'lastName'}
                            label={'Last name'}
                            required={true}
                            placeholder={'Doe'}
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />

                        <ModalFooter
                            submitLabel='Save Changes'
                            onSubmit={handleEditProfile}
                            onClose={onClose}
                        />
                    </section>
                </Modal>
            </ModalBackground>

            {isReStarting && (
                <ModalBackground>
                    <Modal>
                        <p className='text-center mb-4'>
                            Logging you out to apply profile changes.
                        </p>
                        <Loading /> 
                    </Modal>
                </ModalBackground>
            )}
        </>
    )
}