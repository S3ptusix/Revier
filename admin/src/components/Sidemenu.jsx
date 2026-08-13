/* eslint-disable no-unused-vars */
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Building2, ChevronRight, FileChartColumnIncreasing, LayoutDashboard, Menu, MonitorCog, UserCheck, UserCog, Users, UserX, X } from 'lucide-react'
import { useContext, useState } from 'react'
import { UserContext } from '../context/AuthProvider';
import Settings from './Settings';

const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/companies', label: 'Companies', icon: Building2, match: ['/app/companies', '/app/companies/archive'] },
    { path: '/app/jobs', label: 'Jobs', icon: Briefcase, match: ['/app/jobs', '/app/jobs/archive'] },
    { path: '/app/applicants', label: 'Applicants', icon: Users },
    { path: '/app/hired', label: 'Hired', icon: UserCheck },
    { path: '/app/rejected', label: 'Rejected', icon: UserX },
    { path: '/app/reports', label: 'Reports', icon: FileChartColumnIncreasing },
];

export default function Sidemenu() {

    const { admin } = useContext(UserContext);

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    const isActive = (item) => (item.match || [item.path]).includes(location.pathname);

    return (
        <>
            {showMenu && (
                <div
                    className='fixed inset-0 bg-black/30 z-998 md:hidden'
                    onClick={() => setShowMenu(false)}
                />
            )}

            <div className={`flex flex-col gap-6 p-5 max-md:fixed top-0 bottom-0 bg-white border-r border-gray-200 max-sm:w-72 sm:min-w-64 ${showMenu ? 'left-0' : 'max-sm:-left-full sm:-left-64'} duration-200 z-999`}>

                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <img
                            src="/revier-icon.svg"
                            alt="revier icon"
                            className="h-7"
                        />
                        <p className='font-extrabold text-emerald-500 text-2xl tracking-tight'>REVIER</p>
                    </div>
                    <button
                        className='md:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        onClick={() => setShowMenu(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                <button
                    className="group p-2.5 rounded-xl cursor-pointer border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                    onClick={() => setOpenSettings(true)}
                >
                    <div className='flex items-center gap-3'>
                        <span className="bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm rounded-lg h-9 w-9 shrink-0">
                            {admin?.firstName[0]}{admin?.lastName[0]}
                        </span>
                        <div className='min-w-0 text-left'>
                            <p className="font-semibold text-sm text-gray-900 truncate">{admin?.firstName} {admin?.lastName}</p>
                            <p className="font-medium text-xs text-gray-500 truncate">{admin?.role}</p>
                        </div>
                        <ChevronRight size={16} className='text-gray-300 group-hover:text-gray-400 shrink-0 ml-auto' />
                    </div>
                </button>

                <ul className='flex flex-col gap-1'>
                    {navItems.map(({ path, label, icon: Icon, match }) => {
                        const active = (match || [path]).includes(location.pathname);
                        return (
                            <li key={path}>
                                <Link
                                    to={path}
                                    onClick={() => setShowMenu(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${active
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={17} className={active ? 'text-white' : 'text-emerald-500'} />
                                    {label}
                                </Link>
                            </li>
                        );
                    })}

                    {admin?.role === 'HR Manager' && (
                        <>
                            <hr className='border-gray-300 my-2' />
                            <li>
                                <Link
                                    to='/app/admins'
                                    onClick={() => setShowMenu(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${location.pathname === '/app/admins'
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <UserCog size={17} className={location.pathname === '/app/admins' ? 'text-white' : 'text-emerald-500'} />
                                    Admins
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to='/app/systemContent'
                                    onClick={() => setShowMenu(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${location.pathname === '/app/systemContent'
                                            ? 'bg-emerald-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <MonitorCog size={17} className={location.pathname === '/app/systemContent' ? 'text-white' : 'text-emerald-500'} />
                                    System Content
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            <button
                className="fixed bottom-6 left-6 md:hidden bg-emerald-500 text-white p-3 rounded-full shadow-lg shadow-emerald-500/30 z-997"
                onClick={() => setShowMenu(prev => !prev)}
            >
                <Menu size={18} />
            </button>

            {openSettings &&
                <Settings onClose={() => setOpenSettings(false)} />
            }
        </>
    )
}