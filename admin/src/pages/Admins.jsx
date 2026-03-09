import { EllipsisVertical, Plus, Search, Shield, SquarePen, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import AddAdmin from "../components/AddAdmin";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function Admins() {

    const [openAddAdmin, setOpenAddAdmin] = useState(false);

    const admins = [
        {
            id: 1,
            fullname: "Jahleel Casintahan",
            email: "jahleelnemuel@gmail.com",
            role: "HR Manager",
            assignedCompanies: [],
            status: "active",
            lastLogin: "2026-02-01 10:30 AM"
        },
        {
            id: 2,
            fullname: "Admin User",
            email: "admn@gmail.com",
            role: "HR Associate",
            assignedCompanies: ['company1', 'company2'],
            status: "inactive",
            lastLogin: "2026-01-01 10:30 PM"
        },
    ];

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* admin header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Admin Management</p>
                            <p className="text-gray-500">Manage system administrators and permissions</p>
                        </div>
                        <button
                            className="btn bg-emerald-500 text-white rounded-lg"
                            onClick={() => setOpenAddAdmin(true)}
                        >
                            <Plus size={16} />
                            <p className="font-semibold text-sm cursor-pointer">Add Admin</p>
                        </button>
                    </section>

                    {/* admin totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Admins</p>
                                <UserCog size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">4</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">HR Managers</p>
                                <Shield size={16} className="text-purple-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">HR Associates</p>
                                <UserCog size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">3</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Active</p>
                                <UserCog size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">4</p>
                        </div>
                    </section>

                    {/* admin table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                        <div className="flex gap-4 items-center  md:justify-between mb-8 flex-wrap">
                            <div className="flex input-search-container grow">
                                <Search className="search-icon" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Admins..."
                                    className="input-search grow"
                                />
                            </div>

                            <select
                                name="industry"
                                className="select grow"
                            >
                                <option value="">All Roles</option>
                                <option value="HR Manager">HR Manager</option>
                                <option value="HR Associate">HR Associate</option>
                            </select>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Admin</th>
                                        <th>Role</th>
                                        <th>Assigned Companies</th>
                                        <th>Status</th>
                                        <th>Last Login</th>
                                        <th className="action-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map(admin => (
                                        <tr key={admin?.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <span className="profile-logo h-10 w-10">{admin?.fullname[0]}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold">{admin?.fullname}</p>
                                                        <p className="text-sm text-gray-500">{admin?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <p className={` status-style text-white ${admin?.role === 'HR Manager' ? 'bg-purple-500' : 'bg-emerald-500'}`}>{admin?.role}</p>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-1">

                                                    {admin?.role === 'HR Manager' ?
                                                        <p className=" status-style border border-gray-300">All Companies</p> :
                                                        admin?.assignedCompanies.map((company, index) => <p key={index} className=" status-style border border-gray-300">{company}</p>)
                                                    }
                                                </div>
                                            </td>
                                            <td>
                                                <p className={` status-style ${admin?.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-black'}`}>{admin?.status}</p>
                                            </td>
                                            <td>
                                                <p className="">{admin?.lastLogin}</p>
                                            </td>
                                            <td>
                                                <div className="relative flex-center">
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger className="btn btn-square btn-ghost border-none hover:bg-gray-200 rounded-lg outline-0">
                                                            <EllipsisVertical size={16} />
                                                        </DropdownMenu.Trigger>

                                                        <DropdownMenu.Content
                                                            align="end"
                                                            className="minimenu"
                                                        >
                                                            <DropdownMenu.Item>
                                                                <SquarePen size={16} />
                                                                Edit Role
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item>
                                                                {admin?.status === 'active' ? 'Deactivate' : 'active'}
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item className={`text-red-500 ${admin?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}>
                                                                <Trash2 size={16} />
                                                                Delete
                                                            </DropdownMenu.Item>
                                                        </DropdownMenu.Content>
                                                    </DropdownMenu.Root>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>

            {openAddAdmin && <AddAdmin onClose={() => setOpenAddAdmin(false)} />}
        </div>
    )
}