/* eslint-disable react-hooks/exhaustive-deps */
import { Briefcase, FileText, TrendingDown, Users } from "lucide-react";
import HiringTrendsAnalysisComponent from "../components/HiringTrendsAnalysisComponent";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import JobsByIndustryComponent from "../components/JobsByIndustryComponent";
import AttritionRateTrendComponent from "../components/AttritionRateTrendComponent";
import ApplicantStatusDistributionComponent from "../components/ApplicantStatusDistributionComponents";
import TopPerformingCompaniesComponent from "../components/TopPerformingCompaniesComponents";
import { fetchAllSelectCompany } from "../services/companyServices";
import { useState } from "react";
import Select from "../components/ui/Select";
import { useEffect } from "react";
import Input from "../components/ui/Input";
import { getCurrentMonth } from "../utils/tools";
import { fetchReportsTotals } from "../services/reportsServices";


export default function Reports() {

    const [monthYear, setMonthYear] = useState(getCurrentMonth);
    const [company, setCompany] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const [totals, setTotals] = useState({
        totalHires: 0,
        totalApplications: 0,
        jobs: 0,
        attritionRate: 0
    })

    const runFetchAllCompany = async () => {
        const { success, message, companies } = await fetchAllSelectCompany();

        if (success) {
            setSelectCompanies(companies);
        } else {
            console.error(message);
        }
    };

    const loadTotals = async () => {
        const { success, message, totals } = await fetchReportsTotals({ companyId: company, monthYear });
        if (success) return setTotals(totals);
        console.error(message);
    }

    useEffect(() => {
        queueMicrotask(() => {
            runFetchAllCompany();
        })
    }, []);

    useEffect(() => {
        loadTotals();
    }, [company, monthYear]);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                <Topbar />
                <div className="p-8 overflow-autos grow">

                    {/* report header */}
                    <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                        <div>
                            <p className="text-2xl font-semibold">Reports</p>
                            <p className="text-gray-500">Comprehensive reports and data summaries</p>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <button
                                className="grow btn btn-ghost border-gray-300 rounded-lg"
                            >
                                <FileText size={16} />
                                <p className="font-semibold text-sm cursor-pointer">Export Docx</p>
                            </button>
                        </div>
                    </section>

                    <section className="flex items-center justify-between gap-4 border border-gray-300 p-4 rounded-xl mb-8 flex-wrap">
                        <div className="grow">
                            <p className="font-semibold">Report Filters</p>
                            <p className="text-gray-500">Select company and date range for detailed reports</p>
                        </div>
                        <div className="grow flex gap-4">
                            <Select
                                placeholder="All Companies"
                                options={selectCompanies?.map(company => ({ value: company.id, name: company.companyName }))}
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />

                            <Input
                                type="month"
                                value={monthYear}
                                onChange={(e) => setMonthYear(e.target.value)}
                            />
                        </div>
                    </section>

                    <section className="grid lg:grid-cols-4 gap-4 mb-8">
                        <div className="border border-gray-300 px-4 py-6 rounded-xl bg-emerald-500 text-white">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Hires</p>
                                <Users size={16} className="shrink-0" />
                            </div>
                            <p className="font-bold text-2xl mb-2">{totals?.totalHires || 0}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Rejected</p>
                                <Briefcase size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.totalRejected || 0}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Total Applications</p>
                                <FileText size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.totalApplications || 0}</p>
                        </div>
                        <div className="border border-gray-300 px-4 py-6 rounded-xl">
                            <div className="flex items-center justify-between mb-8">
                                <p className="font-semibold text-sm">Attrition Rate</p>
                                <TrendingDown size={16} className="text-emerald-500 shrink-0" />
                            </div>
                            <p className="font-bold text-2xl">{totals?.attritionRate || 0}%</p>
                            <p className="text-xs text-gray-500">(total rejected / total applications) * 100</p>
                        </div>
                    </section>

                    <section className="grid lg:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Hiring Trends Analysis</p>
                            <p className="text-gray-500 mb-4">Applications, interviews, and hires over time</p>
                            <div className="grow">
                                <HiringTrendsAnalysisComponent
                                    company={company}
                                    year={monthYear.substring(0, 4)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Attrition Rate Trend</p>
                            <p className="text-gray-500 mb-4">Employee retention and attrition over time</p>
                            <div className="grow">
                                <AttritionRateTrendComponent
                                    company={company}
                                    year={monthYear.substring(0, 4)}
                                />
                            </div>
                        </div>
                    </section>

                    <hr className="my-8 h-1 bg-gray-300 border-none rounded-full" />

                    <div className="flex flex-col justify-between border border-gray-300 p-4 rounded-xl mb-8">
                        <p className="font-semibold">Current Status</p>
                        <p className="text-gray-500">Overview of the current requirement status</p>
                    </div>

                    <section className="grid lg:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Applicant Status Distribution</p>
                            <p className="text-gray-500 mb-4">Current status breakdown of all applicants</p>
                            <div className="grow">
                                <ApplicantStatusDistributionComponent
                                    company={company}
                                    monthYear={monthYear}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                            <p className="font-semibold">Jobs by Industry</p>
                            <p className="text-gray-500 mb-4">Distribution of job postings across industries</p>
                            <div className="grow">
                                <JobsByIndustryComponent />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl mb-8">
                        <p className="font-semibold">Top Performing Companies</p>
                        <p className="text-gray-500 mb-4">Companies with highest hiring activity</p>
                        <div className="grow">
                            <TopPerformingCompaniesComponent />
                        </div>
                    </div>

                    <section className="grid lg:grid-cols-3 gap-4">
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Top Performing Companies</p>
                            <p className="text-gray-500 mb-4">Companies with highest hiring activity</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">37.9%</p>
                            <p className="text-gray-500 mb-4">383 hires from 1,010 applications</p>
                        </div>
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Avg. Time to Hire</p>
                            <p className="text-gray-500 mb-4">From application to offer</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">18 days</p>
                            <p className="text-gray-500 mb-4">3 days faster than last period</p>
                        </div>
                        <div className="border border-gray-300 p-4 rounded-xl">
                            <p className="font-semibold">Interview Success Rate</p>
                            <p className="text-gray-500 mb-4">Interviews to hires</p>
                            <p className="font-bold text-3xl text-emerald-500 mb-2">64.2%</p>
                            <p className="text-gray-500 mb-4">383 hires from 596 interviews</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}