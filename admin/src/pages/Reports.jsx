/* eslint-disable react-hooks/exhaustive-deps */
import { FileText } from "lucide-react";
import Sidemenu from "../components/Sidemenu";
import Topbar from "../components/Topbar";
import { fetchAllSelectCompany } from "../services/companyServices";
import { useState } from "react";
import Select from "../components/ui/Select";
import { useEffect } from "react";
import { monthlyAttritionRate } from "../services/reportsServices";
import Loading from "../components/Loading";
import NoData from "../components/ui/NoData";
import { generateYearList } from "../utils/tools";
import { generateAttritionDocx } from "../utils/generateReport";
import { generateAttritionPPT } from "../utils/generateReportPPT";


export default function Reports() {

    const [report, setReport] = useState({
        year: '',
        companyName: '',
        data: []
    });

    const yearList = generateYearList();

    const [isLoading, setIsLoading] = useState(false);

    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);

    const [companyId, setCompanyId] = useState('');
    const [selectCompanies, setSelectCompanies] = useState([]);

    const [dataMonthlyAttritionRate, setDataMonthlyAttritionRate] = useState([]);

    const runFetchAllCompany = async () => {
        const { success, message, companies } = await fetchAllSelectCompany();

        if (success) {
            setSelectCompanies(companies);
        } else {
            console.error(message);
        }
    };

    const loadMonthlyAttritionRate = async () => {
        try {
            const { success, message, year: apiYear, companyName: apiCompanyName, data: apiMonthlyAttritionRate } = await monthlyAttritionRate({ companyId, year });
            if (success) {
                setDataMonthlyAttritionRate(apiMonthlyAttritionRate);
                setReport({
                    year: apiYear,
                    companyName: apiCompanyName,
                    data: apiMonthlyAttritionRate,
                })
                return
            };
            console.error(message);
        } catch (error) {
            console.error(error);
        }
    }

    const loadAfter = async () => {
        try {
            setIsLoading(true);
            await Promise.all([
                runFetchAllCompany(),
                loadMonthlyAttritionRate()
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
        loadMonthlyAttritionRate();
    }, [companyId, year]);

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

                            {/* report header */}
                            <section className="flex items-center justify-between flex-wrap gap-4 mb-8">
                                <div>
                                    <p className="text-2xl font-semibold">Reports</p>
                                    <p className="text-gray-500">Comprehensive reports and data summaries</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="btn bg-red-500 text-white rounded-lg"
                                        onClick={() => generateAttritionPPT(report)}
                                    >
                                        <FileText size={16} />
                                        <p className="font-semibold text-sm cursor-pointer">Export PPT</p>
                                    </button>
                                    <button
                                        className="btn bg-blue-500 text-white rounded-lg"
                                        onClick={() => generateAttritionDocx(report)}
                                    >
                                        <FileText size={16} />
                                        <p className="font-semibold text-sm cursor-pointer">Export Docx</p>
                                    </button>
                                </div>
                            </section>
                            <section className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 border border-gray-300 p-4 rounded-lg mb-8">
                                <Select
                                    placeholder="All Companies"
                                    options={selectCompanies?.map(company => ({ value: company.id, name: company.companyName }))}
                                    value={companyId}
                                    onChange={(e) => setCompanyId(e.target.value)}
                                />
                                <Select
                                    options={yearList}
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </section>

                            {/* <section className="border border-gray-300 p-4 rounded-lg mb-8">
                        <p className="font-semibold mb-4">JOB PERFORMANCE</p>

                        {data.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>MONTH</th>
                                            <th>POSITION</th>
                                            <th>RECEIVED RESUMES</th>
                                            <th>INTERVIEWED</th>
                                            <th>ORIENTED</th>
                                            <th>HIRED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(admin => (
                                            <tr key={admin?.id}>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg overflow-hidden">
                                <NoData message="NO DATA FOUND" />
                            </div>
                        )}
                    </section> */}

                            <section className="border border-gray-300 p-4 rounded-lg mb-8">
                                <p className="font-semibold mb-4">MONTHLY ATTRITION RATE</p>

                                {dataMonthlyAttritionRate.length > 0 ? (
                                    <div className="table-style">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>MONTH</th>
                                                    <th>NUMBER OF EMPLOYEES AT THE START OF THE MONTH</th>
                                                    <th>EMPLOYEE JOINED</th>
                                                    <th>EMPLOYEE LEFT</th>
                                                    <th>NUMBER OF EMPLOYEES AT THE END OF THE MONTH</th>
                                                    <th>ATTRITION RATE %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataMonthlyAttritionRate.map((monthlyAttritionRate, index) => (
                                                    <tr key={index}>
                                                        <td>{monthlyAttritionRate?.month}</td>
                                                        <td>{monthlyAttritionRate?.startHeadCount}</td>
                                                        <td>{monthlyAttritionRate?.joined}</td>
                                                        <td>{monthlyAttritionRate?.leavers}</td>
                                                        <td>{monthlyAttritionRate?.endHeadCount}</td>
                                                        <td>{monthlyAttritionRate?.attritionRate}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="rounded-lg overflow-hidden">
                                        <NoData message="NO DATA FOUND" />
                                    </div>
                                )}
                            </section>

                            {/* <section className="border border-gray-300 p-4 rounded-lg mb-8">
                        <p className="font-semibold mb-4">INTERVIEW PERFORMANCE</p>

                        {data.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>MONTH</th>
                                            <th>POSITION</th>
                                            <th>PASSED INTERVIEW</th>
                                            <th>FAILED INTERIVIEW</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(admin => (
                                            <tr key={admin?.id}>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg overflow-hidden">
                                <NoData message="NO DATA FOUND" />
                            </div>
                        )}
                    </section> */}

                            {/* <section className="border border-gray-300 p-4 rounded-lg mb-8">
                        <p className="font-semibold mb-4">ORIENTATION PERFORMANCE</p>

                        {data.length > 0 ? (
                            <div className="table-style">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>MONTH</th>
                                            <th>POSITION</th>
                                            <th>PENDING</th>
                                            <th>PRESENT</th>
                                            <th>ABSENT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map(admin => (
                                            <tr key={admin?.id}>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg overflow-hidden">
                                <NoData message="NO DATA FOUND" />
                            </div>
                        )}
                    </section> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}