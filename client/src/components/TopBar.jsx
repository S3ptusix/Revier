import { Link, useLocation } from "react-router-dom"
import { Bell, LogOut, Menu, User, X } from 'lucide-react'
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/AuthProvider";
import Notifications from "./Notifications";
import { useEffect } from "react";
import { socket } from "../socket";

export default function TopBar() {

    const { user } = useContext(UserContext);

    const [hasNew, setHasNew] = useState(false);

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);

    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const handleNewNotification = () => {
            setHasNew(true);
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, []);

    return (
        <>
            <style>{`
                .dropdown-menu {
                    display: grid;
                    grid-template-rows: 0fr;
                    opacity: 0;
                    transition: grid-template-rows 0.3s ease, opacity 0.25s ease;
                }
                .dropdown-menu.open {
                    grid-template-rows: 1fr;
                    opacity: 1;
                }
                .dropdown-menu-inner {
                    overflow: hidden;
                }
                @media (min-width: 768px) {
                    .dropdown-menu {
                        display: none;
                    }
                }
            `}</style>

            <div className="relative flex items-center justify-between py-4 md:px-[10vw] bg-white">
                <Link to={'/'} className="max-md:ml-4">
                    <img src="/revier-icon.svg" alt="revier icon" />
                </Link>


                <div className="max-md:hidden">
                    <Link
                        to={'/'}

                    >
                        <button className={`btn btn-ghost bg-transparent shadow-none border-none ${location.pathname === '/' ? 'text-emerald-500' : ''}`}>
                            Home
                        </button>
                    </Link>

                    <Link
                        to={'/jobposting'}

                    >
                        <button className={`btn btn-ghost bg-transparent shadow-none border-none ${location.pathname === '/jobposting' ? 'text-emerald-500' : ''}`}>
                            Find Jobs
                        </button>
                    </Link>

                    <Link
                        to={'/contact'}

                    >
                        <button className={`btn btn-ghost bg-transparent shadow-none border-none ${location.pathname === '/contact' ? 'text-emerald-500' : ''}`}>
                            Contact Us
                        </button>
                    </Link>

                </div>

                <div className="flex gap-2 max-md:mr-4">
                    {user ? (
                        <>
                            <button
                                className="relative btn btn-square bg-gray-200 shadow-none border-none rounded-lg"
                                onClick={() => {
                                    setShowNotifications(true);
                                    setHasNew(false); // clear badge
                                }}
                            >
                                {hasNew && (
                                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full"></span>
                                )}
                                <Bell size={16} />
                            </button>

                            <Link to={'/dashboard'}>
                                <button className="btn btn-square bg-emerald-500 text-white shadow-none border-none rounded-lg">
                                    {user.firstName[0]}{user.lastName[0]}
                                </button>
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={'/register'}
                            className="w-fit"
                        >
                            <button className="
                        btn btn-ghost border-black text-black rounded-full
                        hover:bg-emerald-500 hover:border-emerald-500 hover:text-white
                        ">

                                Get Started
                            </button>
                        </Link>
                    )}
                    <button
                        className="md:hidden btn btn-square bg-gray-200 border-none shadow-none rounded-lg"
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        {showMenu ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </div>

            <div className={`md:hidden dropdown-menu ${showMenu ? 'open' : ''}`}>
                <div className="dropdown-menu-inner flex flex-col gap-2 bg-white p-4">

                    <Link
                        to={'/'}

                    >
                        <button className={`p-4 text-sm font-semibold transition ${location.pathname === '/home' ? 'text-emerald-500' : ''}`}>
                            Home
                        </button>
                    </Link>
                    <Link
                        to={'/jobposting'}

                    >
                        <button className={`p-4 text-sm font-semibold transition ${location.pathname === '/jobposting' ? 'text-emerald-500' : ''}`}>
                            Find Jobs
                        </button>
                    </Link>

                    <Link
                        to={'/contact'}

                    >
                        <button className={`p-4 text-sm font-semibold transition ${location.pathname === '/contact' ? 'text-emerald-500' : ''}`}>
                            Contact Us
                        </button>
                    </Link>
                </div>
            </div>
            {showNotifications &&
                <Notifications
                    onClose={() => setShowNotifications(false)}
                />
            }
        </>
    )
}
