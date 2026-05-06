import { Link, useLocation, useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import { logoutUser } from "../services/authServices";
import Notifications from "./Notifications";

export default function Topbar() {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate();

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);

    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = async () => {
        try {
            const { success } = await logoutUser();
            if (success) {
                setUser(null);
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('Error on handleLogout:', error);
        }
    }

    return (
        <div className="relative flex items-center justify-between bg-white px-[10vw] py-4 z-999">
            <div className="flex items-center gap-2 text-emerald-500">
                <img src="/revier-icon.svg" alt="revier icon" />
                <p className="text-2xl font-extrabold">REVIER</p>
            </div>
            <button
                className="md:hidden btn btn-square btn-ghost"
                onClick={() => setShowMenu(prev => !prev)}
            >
                {showMenu ? <X /> : <Menu />}
            </button>
            <div className={`bg-white flex gap-4 max-md:absolute left-0 right-0 max-md:py-4 max-md:px-[10vw] max-md:flex-col max-md:shadow-md ${showMenu ? 'top-1/1' : '-top-1/1 max-md:pointer-events-none max-md:opacity-0'} duration-200`}>
                <Link
                    to={'/home'}

                >
                    <button className={`btn btn-ghost max-md:w-full max-md:justify-start rounded-lg font-normal ${location.pathname === '/home' ? 'bg-emerald-100 text-emerald-500' : ''}`}>
                        Home
                    </button>
                </Link>
                <Link
                    to={'/jobposting'}

                >
                    <button className={`btn btn-ghost max-md:w-full max-md:justify-start rounded-lg font-normal ${location.pathname === '/jobposting' ? 'bg-emerald-100 text-emerald-500' : ''}`}>
                        Find Jobs
                    </button>
                </Link>

                {user && (
                    <Link to={'/applications'}>
                        <button className={`md:hidden btn btn-ghost max-md:w-full max-md:justify-start rounded-lg font-normal ${location.pathname === '/myapplications' ? 'bg-emerald-100 text-emerald-500' : ''}`}>
                            My Applications
                        </button>
                    </Link>
                )}

                <hr className="md:hidden border-gray-300" />

                {user ? (
                    <>
                        <button
                            className="relative font-normal max-md:justify-start btn md:btn-square btn-ghost max-md:gap-4 rounded-lg max-md:w-full"
                            onClick={() => setShowNotifications(true)}
                        >
                            <span className="absolute top-0 right-0 h-2 w-2 bg-emerald-500 rounded-full"></span>
                            <Bell size={16} />
                            <span className="md:hidden">Notification</span>
                        </button>

                        <Link to={'/dashboard'}>
                            <button className="font-normal max-md:justify-start btn btn-ghost max-md:gap-4 rounded-lg max-md:w-full">
                                <span className="md:bg-emerald-100 md:text-emerald-500 md:rounded-full md:p-2"><User size={16} /></span>
                                {user.firstName} {user.lastName}
                            </button>
                        </Link>

                        <button
                            className="md:hidden font-normal max-md:justify-start btn btn-ghost max-md:gap-4 rounded-lg text-red-500"
                            onClick={handleLogout}
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to={'/login'}
                        >
                            <button className="btn btn-ghost rounded-lg">
                                Sign in
                            </button>
                        </Link>
                        <Link
                            to={'/register'}
                        >
                            <button className="btn bg-emerald-500 text-white rounded-lg">

                                Get Started
                            </button>
                        </Link>
                    </>
                )}
            </div>

            {showNotifications &&
                <Notifications
                    onClose={() => setShowNotifications(false)}
                />
            }
        </div>
    )
}