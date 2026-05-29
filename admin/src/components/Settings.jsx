import { ChevronRight, ClipboardClock, Lock, LogOut, User, UserRoundPen } from 'lucide-react';
import { Modal, ModalBackground, ModalHeader } from "./ui/ui-modal";
import Input from './ui/Input';
import { useContext, useState } from 'react';
import { UserContext } from '../context/AuthProvider';
import { logoutAdmin } from '../services/authServices';
import MyProfile from './MyProfile';
import LogHistory from './LogHistory';
import ChangePassword from './ChangePassword';
import VerifyEmail from './VerifyEmail';
import { sendOtp } from '../services/otpServices';
import { toast } from 'react-toastify';

export default function Settings({ onClose = () => { } }) {


    const { admin, setAdmin } = useContext(UserContext);

    const [openMyProfile, setOpenMyProfile] = useState(false);
    const [openLogHistory, setOpenLogHistory] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

    const handleLogout = async () => {
        try {
            const { success } = await logoutAdmin();
            if (success) {
                setAdmin(null);
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    const handleChangePassword = async () => {
        try {
            const { success, message } = await sendOtp();
            if (success) {
                setOpenVerifyEmail(true);
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <ModalBackground>
                <Modal>
                    <section className='space-y-8'>
                        <ModalHeader
                            title="Settings"
                            onClose={onClose}
                        />
                        <div className='flex items-center gap-2'>
                            <div className='bg-emerald-500 text-white flex-center h-10 w-10 rounded-full'>
                                {admin?.firstName[0]}{admin?.lastName[0]}
                            </div>
                            <div>
                                <p className='font-semibold'>{admin?.firstName} {admin?.lastName}</p>
                                <p className='text-sm text-gray-500'>{admin?.role}</p>
                            </div>
                        </div>
                        <div className='bg-gray-100 rounded-xl overflow-hidden'>
                            <button
                                className='p-4 cursor-pointer w-full hover:bg-gray-200 flex justify-between items-center text-sm'
                                onClick={() => setOpenMyProfile(true)}
                            >
                                <div className='flex gap-2 items-center'>
                                    <span className='p-1 rounded-lg text-emerald-500 bg-emerald-500/25'><User size={16} /></span> My Profile
                                </div>
                                <ChevronRight size={16} />
                            </button>
                            <button
                                className='p-4 cursor-pointer w-full hover:bg-gray-200 flex justify-between items-center text-sm'
                                onClick={() => setOpenLogHistory(true)}
                            >
                                <div className='flex gap-2 items-center'>
                                    <span className='p-1 rounded-lg text-emerald-500 bg-emerald-500/25'><ClipboardClock size={16} /></span> Log History
                                </div>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className='bg-gray-100 rounded-xl overflow-hidden'>
                            <button
                                className='p-4 cursor-pointer w-full hover:bg-gray-200 flex justify-between items-center text-sm'
                                onClick={handleChangePassword}
                            >
                                <div className='flex gap-2 items-center'>
                                    <span className='p-1 rounded-lg text-emerald-500 bg-emerald-500/25'><Lock size={16} /></span> Change Password
                                </div>
                                <ChevronRight size={16} />
                            </button>
                            <button
                                className='p-4 cursor-pointer w-full hover:bg-gray-200 flex justify-between items-center text-sm'
                                onClick={handleLogout}
                            >
                                <div className='flex gap-2 items-center'>
                                    <span className='p-1 rounded-lg text-red-500 bg-red-500/25'><LogOut size={16} /></span> Log Out
                                </div>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </section>
                </Modal>
            </ModalBackground>
            {openMyProfile && (
                <MyProfile
                    onClose={() => setOpenMyProfile(false)}
                />
            )}
            {openLogHistory && (
                <LogHistory
                    onClose={() => setOpenLogHistory(false)}
                />
            )}
            {openVerifyEmail && (
                <VerifyEmail
                    onClose={() => setOpenVerifyEmail(false)}
                    email={admin.email}
                    successFunction={() => setOpenChangePassword(true)}
                />
            )}
            {openChangePassword && (
                <ChangePassword
                    onClose={() => setOpenChangePassword(false)}
                />
            )}
        </>
    )
}