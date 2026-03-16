import { Link, useLocation } from 'react-router-dom'
import { Briefcase, Building2, Calendar, ClipboardCheck, FileChartColumnIncreasing, LayoutDashboard, Menu, UserCheck, UserCog, Users, UserX } from 'lucide-react'
import { useContext, useState } from 'react'
import { UserContext } from '../context/AuthProvider';

export default function Sidemenu() {

    const { admin } = useContext(UserContext);

    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);

    return (
        <>
            <div className={`max-md:fixed top-0 bottom-0 bg-white border-r border-gray-300 max-sm:w-full sm:min-w-75 ${showMenu ? 'left-0' : 'max-sm:-left-full sm:-left-75'} duration-200 z-999`}>
                <div className='border-b border-gray-300 flex flex-col items-center p-4 mb-8'>
                    <img
                        src="/revier-icon.svg"
                        alt="revier icon"
                        className="h-8"
                    />
                    <p className='font-extrabold text-emerald-500 text-3xl'>REVIER</p>
                </div>
                <ul className='sidemenu-ul'>
                    <li className={`${location.pathname === '/app/dashboard' ? 'active' : ''}`}>
                        <Link to={'/app/dashboard'}>
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/companies' ? 'active' : ''}`}>
                        <Link to={'/app/companies'}>
                            <Building2 size={16} />
                            Companies
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/jobs' ? 'active' : ''}`}>
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
                    <li className={`${location.pathname === '/app/interviews' ? 'active' : ''}`}>
                        <Link to={'/app/interviews'}>
                            <Calendar size={16} />
                            Interviews
                        </Link>
                    </li>
                    <li className={`${location.pathname === '/app/orientations' ? 'active' : ''}`}>
                        <Link to={'/app/orientations'}>
                            <ClipboardCheck size={16} />
                            Orientations
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
        </>
    )
}