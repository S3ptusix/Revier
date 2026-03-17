/* eslint-disable react-hooks/exhaustive-deps */
import { EllipsisVertical, Plus, Shield, SquarePen, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import AddAdmin from "../components/AddAdmin";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchAdminTotals, fetchAllAdmin } from "../services/adminServices";
import { useEffect } from "react";
import DeleteAdmin from "../components/DeleteAdmin";
import EditAdmin from "../components/EditAdmin";
import Select from "../components/ui/Select";

export default function Admins() {

    const [totals, setTotals] = useState([]);
    const [data, setData] = useState([]);

    const [role, setRole] = useState('');

    const [adminId, setAdminId] = useState(null);
    const [openAddAdmin, setOpenAddAdmin] = useState(false);
    const [openDeleteAdmin, setOpenDeleteAdmin] = useState(false);
    const [openEditAdmin, setOpenEditAdmin] = useState(false);


    const handleDelete = (adminId) => {
        setAdminId(adminId);
        setOpenDeleteAdmin(true);
    }

    const handleEdit = (adminId) => {
        setAdminId(adminId);
        setOpenEditAdmin(true);
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchAdminTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, admins } = await fetchAllAdmin({ role });
        if (success) return setData(admins);
        console.error(message);
    }

    const loadAfter = () => {
        loadTotals();
        loadTable();
    }

    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadAfter();
            })
        } catch (error) {
            console.error(error);
        }
    }, [role]);

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
                    <section className="grid lg:grid-cols-3 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Admins</p>
                                <UserCog size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.totalAdmins}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">HR Managers</p>
                                <Shield size={16} className="text-purple-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.hrManagers}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">HR Associates</p>
                                <UserCog size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals.hrAssociates}</p>
                        </div>
                    </section>

                    {/* admin table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">
                        <div className="flex gap-4 items-center md:justify-between mb-8 flex-wrap">
                            <p className="font-semibold grow">Admins</p>
                            <div className="w-75">
                                <Select
                                    placeholder={'All Roles'}
                                    options={[
                                        { name: 'HR Manager', value: 'HR Manager' },
                                        { name: 'HR Associate', value: 'HR Associate' }
                                    ]}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Admin</th>
                                        <th>Role</th>
                                        <th className="action-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(admin => (
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
                                                <div className="relative flex-center">
                                                    <DropdownMenu.Root>
                                                        <DropdownMenu.Trigger className="btn btn-square btn-ghost border-none hover:bg-gray-200 rounded-lg outline-0">
                                                            <EllipsisVertical size={16} />
                                                        </DropdownMenu.Trigger>

                                                        <DropdownMenu.Content
                                                            align="end"
                                                            className="minimenu"
                                                        >
                                                            <DropdownMenu.Item
                                                                onClick={() => handleEdit(admin?.id)}
                                                            >
                                                                <SquarePen size={16} />
                                                                Edit
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item
                                                                className={`text-red-500 ${admin?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}
                                                                onClick={() => handleDelete(admin?.id)}
                                                            >
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

            {openAddAdmin &&
                <AddAdmin
                    onClose={() => setOpenAddAdmin(false)}
                    loadAfter={loadAfter}
                />
            }

            {openDeleteAdmin &&
                <DeleteAdmin
                    adminId={adminId}
                    onClose={() => setOpenDeleteAdmin(false)}
                    loadAfter={loadAfter}
                />
            }

            {openEditAdmin &&
                <EditAdmin
                    adminId={adminId}
                    onClose={() => setOpenEditAdmin(false)}
                    loadAfter={loadAfter}
                />
            }
        </div>
    )
}