/* eslint-disable react-hooks/exhaustive-deps */
import { EllipsisVertical, Plus, Search, Shield, SquarePen, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import AddAdmin from "../components/AddAdmin";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { fetchAdminTotals, fetchAllAdmin } from "../services/adminServices";
import { useEffect } from "react";
import DeleteAdmin from "../components/DeleteAdmin";
import EditAdmin from "../components/EditAdmin";
import Select from "../components/ui/Select";
import Pagination from "../components/Pagination";
import NoData from "../components/ui/NoData";
import Input from "../components/ui/Input";
import Loading from '../components/Loading';

export default function Admins() {

    const [isLoading, setIsLoading] = useState(false);

    const [totals, setTotals] = useState([]);

    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        total: 0,
        totalPages: 1,
    });

    const [search, setSearch] = useState('');
    const [toSearch, setToSearch] = useState('');

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
        const { success, message, admins, pagination: apiPagination } = await fetchAllAdmin({
            search: toSearch,
            role,
            page

        });
        if (success) {
            setData(admins);
            setPagination(apiPagination);
            return;
        }
        console.error(message);
    }

    const loadAfter = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                loadTotals(),
                loadTable()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAfter();
    }, []);

    useEffect(() => {
        setPage(1);
    }, [toSearch, role]);

    useEffect(() => {
        loadTable();
    }, [toSearch, role, page]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <div className="p-8">

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
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 mb-8">
                                <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                    <div className="grow">
                                        <Input
                                            placeholder="Search by name, email, role..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="btn btn-square btn-ghost rounded-lg"
                                        onClick={() => setToSearch(search)}
                                    >
                                        <Search size={16} />
                                    </button>
                                </div>

                                <Select
                                    placeholder={'All Admin Role'}
                                    options={[
                                        { name: 'HR Manager', value: 'HR Manager' },
                                        { name: 'HR Associate', value: 'HR Associate' }
                                    ]}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                />
                            </div>

                            {data.length > 0 ? (
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
                                                            <span className="profile-logo h-10 w-10">{admin?.firstName[0]}{admin?.lastName[0]}</span>
                                                            <div>
                                                                <p className="text-sm font-semibold">{admin?.firstName} {admin?.lastName}</p>
                                                                <p className="text-sm text-gray-500">{admin?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <p className={` status-style text-white ${admin?.role === 'HR Manager' ? 'bg-purple-500' : 'bg-emerald-500'}`}>{admin?.role}</p>
                                                    </td>
                                                    <td>
                                                        {admin?.role === 'HR Associate' && (
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
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="rounded-lg overflow-hidden">
                                    <NoData message="NO ADMIN FOUND" />
                                </div>
                            )}
                            <div className="mt-4">
                                <Pagination
                                    pagination={pagination}
                                    page={page}
                                    setPage={setPage}
                                />
                            </div>
                        </section>
                    </div>
                )}
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