import { useEffect } from "react";
import AttritionRateTrendComponent from "../components/AttritionRateTrendComponent";
import HiringTrendsAnalysisComponent from "../components/HiringTrendsAnalysisComponent";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { Calendar, FileText, Users } from 'lucide-react';
import { fetchDashboardTotals } from "../services/dashboardServices";
import { useState } from "react";
import { getCurrentYear } from "../utils/tools";
import Loading from "../components/Loading";
import ApplicantStatusDistributionComponent from "../components/ApplicantStatusDistributionComponents";
import JobsByIndustryComponent from "../components/JobsByIndustryComponent";
import TopPerformingCompaniesComponent from "../components/TopPerformingCompaniesComponents";

export default function Dashboard() {

    const [isLoading, setIsLoading] = useState(false);

    const year = getCurrentYear();

    const [totals, setTotals] = useState({
        incommingOrientations: 0,
        pipelineApplicants: 0,
        openPositions: 0,
        scheduleForInterview: 0,
        scheduleForOrientation: 0,
    })

    const loadTotals = async () => {
        try {
            setIsLoading(true);
            const { success, message, totals } = await fetchDashboardTotals();
            if (success) return setTotals(totals);
            console.error(message);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }

    }

    useEffect(() => {
        loadTotals();
    }, []);

    return (
        <div className="flex h-screen max-w-screen">
            <Sidemenu />
            <div className="grow max-h-screen flex flex-col overflow-auto">
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Topbar />
                        <div className="p-8 overflow-auto grow">

                            {/* Dashboard header */}
                            <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                                <div>
                                    <p className="text-2xl font-semibold">Dashboard</p>
                                    <p className="text-gray-500">Welcome back! Here's your overview</p>
                                </div>
                            </section>

                            <section className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-8">
                                <div className="p-6 border border-gray-300 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Incomming Orientations</p>
                                        <span className="bg-blue-500/10 text-blue-500 p-2 rounded-full">
                                            <Calendar size={16} />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">{totals?.incommingOrientations || 0}</p>
                                </div>

                                <div className="p-6 border border-gray-300 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Open Positions</p>
                                        <span className="bg-orange-500/10 text-orange-500 p-2 rounded-full">
                                            <FileText size={16} />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">{totals?.openPositions || 0}</p>
                                </div>

                                <div className="p-6 border border-gray-300 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Pipeline Applicants</p>
                                        <span className="bg-emerald-500/10 text-emerald-500 p-2 rounded-full">
                                            <Users size={16} />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">{totals?.pipelineApplicants || 0}</p>
                                </div>

                                <div className="p-6 border border-gray-300 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Schedule For Interview</p>
                                        <span className="bg-purple-500/10 text-purple-500 p-2 rounded-full">
                                            <Calendar size={16} />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">{totals?.scheduleForInterview || 0}</p>
                                </div>

                                <div className="p-6 border border-gray-300 rounded-xl">
                                    <div className="flex items-center justify-between mb-8">
                                        <p className="font-semibold text-sm">Schedule For Orientation</p>
                                        <span className="bg-red-500/10 text-red-500 p-2 rounded-full">
                                            <Calendar size={16} />
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">{totals?.scheduleForOrientation || 0}</p>
                                </div>
                            </section>

                            <section className="grid lg:grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                                    <p className="font-semibold">Hiring Trends Analysis</p>
                                    <p className="text-gray-500 mb-4">Applications, interviews, and hires over time</p>
                                    <div className="grow">
                                        <HiringTrendsAnalysisComponent
                                            year={year}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                                    <p className="font-semibold">Attrition Rate Trend</p>
                                    <p className="text-gray-500 mb-4">Employee retention and attrition over time</p>
                                    <div className="grow">
                                        <AttritionRateTrendComponent
                                            year={year}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col border border-gray-300 h-100 p-4 rounded-xl">
                                    <p className="font-semibold">Applicant Status Distribution</p>
                                    <p className="text-gray-500 mb-4">Current status breakdown of all applicants</p>
                                    <div className="grow">
                                        <ApplicantStatusDistributionComponent />
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
                                <p className="font-semibold">Top 5 Performing Companies</p>
                                <p className="text-gray-500 mb-4">Companies with highest hiring activity</p>
                                <div className="grow">
                                    <TopPerformingCompaniesComponent />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}