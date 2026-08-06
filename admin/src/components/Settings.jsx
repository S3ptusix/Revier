/* eslint-disable no-unused-vars */
import { ChevronRight, ClipboardClock, Loader2, Lock, LogOut, User } from 'lucide-react';
import { Modal, ModalBackground, ModalBody, ModalHeader } from "./ui/ui-modal";
import { useContext, useState } from 'react';
import { UserContext } from '../context/AuthProvider';
import { logoutAdmin } from '../services/authServices';
import MyProfile from './MyProfile';
import LogHistory from './LogHistory';
import ChangePassword from './ChangePassword';
import VerifyEmail from './VerifyEmail';
import { sendOtp } from '../services/otpServices';
import { toast } from 'react-toastify';

function SettingsButton({ icon: Icon, iconColor = 'emerald', label, onClick, disabled, danger = false }) {
    return (
        <button
            disabled={disabled}
            className='group p-4 cursor-pointer w-full hover:bg-gray-100 flex justify-between items-center text-sm transition-colors disabled:pointer-events-none disabled:opacity-50'
            onClick={onClick}
        >
            <div className='flex gap-3 items-center'>
                <span className={`p-1.5 rounded-lg ${danger ? 'text-red-500 bg-red-50' : 'text-emerald-500 bg-emerald-50'}`}>
                    <Icon size={16} />
                </span>
                <span className={`font-medium ${danger ? 'text-red-600' : 'text-gray-700'}`}>{label}</span>
            </div>
            <ChevronRight size={16} className='text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-transform' />
        </button>
    );
}

export default function Settings({ onClose = () => { } }) {

    const { admin, setAdmin } = useContext(UserContext);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [openMyProfile, setOpenMyProfile] = useState(false);
    const [openLogHistory, setOpenLogHistory] = useState(false);
    const [openChangePassword, setOpenChangePassword] = useState(false);
    const [openVerifyEmail, setOpenVerifyEmail] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const { success } = await logoutAdmin();
            if (success) {
                setAdmin(null);
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        } finally {
            setIsLoggingOut(false);
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
                    <ModalHeader
                        title="Settings"
                        onClose={onClose}
                    />

                    <ModalBody>

                        <div className='flex items-center gap-3 pb-2'>
                            <div className='bg-emerald-500 text-white flex items-center justify-center font-semibold h-11 w-11 rounded-lg shrink-0'>
                                {admin?.firstName[0]}{admin?.lastName[0]}
                            </div>
                            <div className='min-w-0'>
                                <p className='font-semibold text-gray-900 truncate'>{admin?.firstName} {admin?.lastName}</p>
                                <p className='text-sm text-gray-500 truncate'>{admin?.role}</p>
                            </div>
                        </div>

                        <div>
                            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1'>Account</p>
                            <div className='bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-200'>
                                <SettingsButton
                                    icon={User}
                                    label='My Profile'
                                    onClick={() => setOpenMyProfile(true)}
                                />
                                <SettingsButton
                                    icon={ClipboardClock}
                                    label='Log History'
                                    onClick={() => setOpenLogHistory(true)}
                                />
                            </div>
                        </div>

                        <div>
                            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1'>Security</p>
                            <div className='bg-gray-50 rounded-xl overflow-hidden divide-y divide-gray-200'>
                                <SettingsButton
                                    icon={Lock}
                                    label='Change Password'
                                    onClick={handleChangePassword}
                                />
                                <SettingsButton
                                    icon={LogOut}
                                    label={isLoggingOut ? 'Logging Out...' : 'Log Out'}
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    danger
                                />
                            </div>
                        </div>

                    </ModalBody>
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

            {isLoggingOut && (
                <ModalBackground>
                    <Loader2 className='animate-spin text-emerald-500' size={28} />
                </ModalBackground>
            )}
        </>
    )
}