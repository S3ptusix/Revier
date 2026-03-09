import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/topbar";
import { Users, ArrowRight, CircleCheckBig, CircleX } from "lucide-react";

export default function Applicants() {

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-auto grow">

                    {/* applicants header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Applicant Pipeline</p>
                            <p className="text-gray-500">Manage applicants through the recruitment workflow</p>
                        </div>
                    </section>

                    {/* applicants totals */}
                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applicants</p>
                                <Users size={16} className="text-gray-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">7</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">In Process</p>
                                <ArrowRight size={16} className="text-blue-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">5</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Hired</p>
                                <CircleCheckBig size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Rejected</p>
                                <CircleX size={16} className="text-red-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">1</p>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    )
}