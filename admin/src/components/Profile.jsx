import { Lock, LogOut, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import Input from './ui/Input';
import { logoutAdmin } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../context/AuthProvider';
import { changePassword, editProfile } from '../services/adminServices';
import { toast } from "react-toastify";
import { useForm } from '../hooks/form';

export default function Profile({ onClose = () => { } }) {

    const { admin, setAdmin } = useContext(UserContext);

    const [fullname, setFullname] = useState(admin?.fullname);

    const { formData, setFormData, handleInputChange } = useForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const navigate = useNavigate();

    const handleEditProfile = async () => {
        try {
            const { success, message } = await editProfile({ fullname });
            if (success) return toast.success(message);
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleChangePassword = async () => {
        try {
            const { success, message } = await changePassword(formData);
            if (success) {
                setFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
                toast.success(message);
                return
            };
            toast.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleLogout = async () => {
        try {
            const { success } = await logoutAdmin();
            if (success) {
                setAdmin(null);
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    return (
        <ModalBackground>
            <Modal>
                <div className='mb-8'>
                    <ModalHeader
                        title="Profile"
                        onClose={onClose}
                    />
                </div>
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 bg-emerald-500 text-white p-4'>
                        <UserRoundPen />
                        <p className="font-semibold">Admin information</p>
                    </div>
                    <Input
                        name="fullname"
                        label='Fullname'
                        placeholder="John Doe"
                        required={true}
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                    <Input
                        name="email"
                        label='Email'
                        disabled={true}
                        value={admin?.email}
                    />
                    <Input
                        name="role"
                        label='Role'
                        disabled={true}
                        value={admin?.role}
                    />
                    <button
                        className='btn bg-emerald-500 text-white rounded-lg'
                        onClick={handleEditProfile}
                    >
                        Edit Profile
                    </button>
                </div>
                <hr className='border-gray-300 my-8' />
                <div className='space-y-4'>
                    <div className='flex items-center gap-2 bg-emerald-500 text-white p-4'>
                        <Lock />
                        <p className="font-semibold">Change password</p>
                    </div>
                    <Input
                        name="currentPassword"
                        label='Current Password'
                        type='password'
                        required={true}
                        placeholder="••••••••"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        name="newPassword"
                        label='New Password'
                        type='password'
                        required={true}
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                    />
                    <Input
                        name="confirmNewPassword"
                        label='Confirm New Password'
                        type='password'
                        required={true}
                        placeholder="••••••••"
                        value={formData.confirmNewPassword}
                        onChange={handleInputChange}
                    />
                    <button
                        className='btn bg-emerald-500 text-white rounded-lg'
                        onClick={handleChangePassword}
                    >
                        Change Password
                    </button>
                </div>
                <hr className='border-gray-300 my-8' />
                <div>
                    <button
                        className="flex items-center gap-2 text-red-500 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </Modal>
        </ModalBackground>
    )
}