/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, Building2, EllipsisVertical, MapPin, Plus, Search, SquarePen, Trash2, UserCog } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import AddCompany from "../components/AddCompany";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { industries } from "../utils/data";
import { useEffect } from "react";
import { fetchAllCompany, fetchCompanyTotals } from "../services/companyServices";
import DeleteCompany from "../components/DeleteCompany";
import EditCompany from "../components/EditCompany";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";


export default function Companies() {

    const [companyId, setCompanyId] = useState(null);
    const [totals, setTotals] = useState({
        totalActiveJobs: 0,
        totalCompanies: 0
    });
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('')
    const [toSearch, setToSearch] = useState('')
    const [industry, setIndustry] = useState('')

    const [openAddCompany, setOpenAddCompany] = useState(false);
    const [openDeleteCompany, setOpenDeleteCompany] = useState(false);
    const [openEditCompany, setOpenEditCompany] = useState(false);


    const handleDelete = (companyId) => {
        setCompanyId(companyId);
        setOpenDeleteCompany(true);
    }

    const handleEdit = (companyId) => {
        setCompanyId(companyId);
        setOpenEditCompany(true);
    }

    const loadTotals = async () => {
        const { success, message, totals } = await fetchCompanyTotals();
        if (success) return setTotals(totals);
        console.error(message);
    }

    const loadTable = async () => {
        const { success, message, companies } = await fetchAllCompany({ search: toSearch, industry });
        if (success) return setData(companies);
        console.error(message);
    }



    useEffect(() => {
        try {
            queueMicrotask(() => {
                loadTotals();
                loadTable();
            })
        } catch (error) {
            console.error(error);
        }
    }, [toSearch, industry]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* company header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Companies</p>
                            <p className="text-gray-500">Manage your partner companies</p>
                        </div>
                        <button
                            className="btn bg-emerald-500 text-white rounded-lg"
                            onClick={() => setOpenAddCompany(true)}
                        >
                            <Plus size={16} />
                            <p className="font-semibold text-sm cursor-pointer">Add Company</p>
                        </button>
                    </section>

                    {/* company totals */}
                    <section className="grid lg:grid-cols-2 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Companies</p>
                                <Building2 size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.totalCompanies}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Active Jobs</p>
                                <Briefcase size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.totalActiveJobs}</p>
                        </div>
                    </section>

                    {/* company table */}
                    <section className="border border-gray-300 p-4 rounded-lg max-w-full">

                        <div className="flex gap-4 md:justify-between mb-8 flex-wrap">
                            <div className="flex input-search-container grow bg-gray-100 rounded-lg">
                                <Input
                                    placeholder="Search Companies..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button
                                    className="btn btn-square btn-ghost rounded-lg"
                                    onClick={() => setToSearch(search)}
                                >
                                    <Search size={16} />
                                </button>
                            </div>

                            <div className="w-75">
                                <Select
                                    placeholder="Select Industry"
                                    options={industries}
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-style">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Industry</th>
                                        <th>Location</th>
                                        <th>Active Jobs</th>
                                        <th className="action-cell">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(company => (
                                        <tr key={company?.id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-emerald-500/25 text-emerald-500 rounded-lg p-2">
                                                        <Building2 />
                                                    </div>
                                                    <p className="text-sm font-semibold">{company?.companyName}</p>
                                                </div>
                                            </td>
                                            <td>
                                                <p>{company?.industry}</p>
                                            </td>
                                            <td>
                                                <p className="flex items-center text-gray-500 gap-1">
                                                    <MapPin size={12} />
                                                    {company?.location}
                                                </p>
                                            </td>
                                            <td>
                                                {company?.jobCount}
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
                                                                onClick={() => handleEdit(company.id)}
                                                            >
                                                                <SquarePen size={16} />
                                                                Edit
                                                            </DropdownMenu.Item>
                                                            <DropdownMenu.Item
                                                                className={`text-red-500 ${company?.role === 'HR Manager' ? 'opacity-50 pointer-events-none' : ''}`}
                                                                onClick={() => handleDelete(company.id)}
                                                            >
                                                                <Trash2 size={16} />
                                                                Delete
                                                            </DropdownMenu.Item>
                                                            {/* <DropdownMenu.Item>
                                                                <UserCog size={16} />
                                                                Assign HR Associates
                                                            </DropdownMenu.Item> */}
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

            {openAddCompany && <AddCompany onClose={() => setOpenAddCompany(false)} loadTable={loadTable} />}

            {openDeleteCompany && <DeleteCompany companyId={companyId} onClose={() => setOpenDeleteCompany(false)} loadTable={loadTable} />}

            {openEditCompany && <EditCompany companyId={companyId} onClose={() => setOpenEditCompany(false)} loadTable={loadTable} />}
        </div>
    )
}