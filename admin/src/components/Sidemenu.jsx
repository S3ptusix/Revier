import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Building2, Calendar, ClipboardCheck, FileChartColumnIncreasing, LayoutDashboard, LogOut, Menu, UserCheck, UserCog, Users, UserX } from 'lucide-react'
import { useContext, useState } from 'react'
import { UserContext } from '../context/AuthProvider';
import Settings from './Settings';

export default function Sidemenu() {

    const { admin } = useContext(UserContext);

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);

    return (
        <>
            <div className={`flex flex-col gap-4 p-4 max-md:fixed top-0 bottom-0 bg-white border-r border-gray-300 max-sm:w-full sm:min-w-75 ${showMenu ? 'left-0' : 'max-sm:-left-full sm:-left-75'} duration-200 z-999`}>
                <div className=' flex flex-col items-center'>
                    <img
                        src="/revier-icon.svg"
                        alt="revier icon"
                        className="h-8"
                    />
                    <p className='font-extrabold text-emerald-500 text-3xl'>REVIER</p>
                </div>

                <button
                    className="p-2 rounded-lg cursor-pointer border border-gray-300 hover:bg-gray-200"
                    onClick={() => setOpenSettings(true)}
                >
                    <div className='flex items-center gap-2'>
                        <span className="bg-emerald-500 text-white flex-center rounded-lg h-8 w-8">
                            {admin?.firstName[0]}{admin?.lastName[0]}
                        </span>
                        <div>
                            <p className="font-semibold text-sm text-left">{admin?.firstName} {admin?.lastName}</p>
                            <p className="font-semibold text-xs text-gray-500 text-left">{admin?.role}</p>
                        </div>
                    </div>
                </button>

                <ul className='sidemenu-ul'>
                    <li className={`${location.pathname === '/app/dashboard' ? 'active' : ''}`}>
                        <Link to={'/app/dashboard'}>
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                    </li>
                    <li className={`${(location.pathname === '/app/companies' || location.pathname === '/app/companies/archive') ? 'active' : ''}`}>
                        <Link to={'/app/companies'}>
                            <Building2 size={16} />
                            Companies
                        </Link>
                    </li>
                    <li className={`${(location.pathname === '/app/jobs' || location.pathname === '/app/jobs/archive') ? 'active' : ''}`}>
                        <Link to={'/app/jobs'}>
                            <Briefcase size={16} />
                            Jobs
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/applicants' ? 'active' : ''}`}>
                        <Link to={'/app/applicants'}>
                            <Users size={16} />
                            Applicants
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/hired' ? 'active' : ''}`}>
                        <Link to={'/app/hired'}>
                            <UserCheck size={16} />
                            Hired
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/rejected' ? 'active' : ''}`}>
                        <Link to={'/app/rejected'}>
                            <UserX size={16} />
                            Rejected
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/resigned' ? 'active' : ''}`}>
                        <Link to={'/app/resigned'}>
                            <UserX size={16} />
                            Resigned
                        </Link>
                    </li>
                    {admin?.role === 'HR Manager' &&
                        <li className={`${location.pathname === '/app/admins' ? 'active' : ''}`}>
                            <Link to={'/app/admins'}>
                                <UserCog size={16} />
                                Admins
                            </Link>
                        </li>
                    }
                    <li className={`${location.pathname === '/app/reports' ? 'active' : ''}`}>
                        <Link to={'/app/reports'}>
                            <FileChartColumnIncreasing size={16} />
                            Reports
                        </Link>
                    </li>
                </ul>
            </div>
            <button
                className="fixed bottom-8 left-8 md:hidden bg-emerald-500 text-white p-2 rounded-lg z-999"
                onClick={() => setShowMenu(prev => !prev)}
            >
                <Menu size={16} />
            </button>
            {openSettings &&
                <Settings onClose={() => setOpenSettings(false)} />
            }
        </>
    )
}