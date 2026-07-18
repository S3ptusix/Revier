/* eslint-disable no-unused-vars */
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Line,
    LineChart

} from 'recharts';
import { useState } from 'react';
import { useEffect } from 'react';
import { monthlyAttritionRate } from '../services/reportsServices';

export default function AttritionRateTrendComponent({ company = '', year = '' }) {

    const [data, setData] = useState([]);

    function transformAttrition(data) {
        const monthMap = {
            January: "Jan",
            February: "Feb",
            March: "Mar",
            April: "Apr",
            May: "May",
            June: "Jun",
            July: "Jul",
            August: "Aug",
            September: "Sep",
            October: "Oct",
            November: "Nov",
            December: "Dec"
        };

        return data.map(item => {
            const avgHeadcount = (item.startHeadCount + item.endHeadCount) / 2;

            const attritionRate =
                avgHeadcount === 0
                    ? 0
                    : Number(((item.leavers / avgHeadcount) * 100).toFixed(2));

            return {
                month: monthMap[item.month],
                attritionRate
            };
        });
    }

    useEffect(() => {
        try {
            const load = async () => {
                try {
                    const { success, message, year: apiYear, companyName: apiCompanyName, data: apiMonthlyAttritionRate } = await monthlyAttritionRate({ companyId: company, year });
                    if (success) {
                        setData(transformAttrition(apiMonthlyAttritionRate));
                        return
                    };
                    console.error(message);
                } catch (error) {
                    console.error(error);
                }
            }
            load();
        } catch (error) {
            console.error(error);
        }
    }, [company, year]);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <YAxis yAxisId="left" domain={[0, 100]} />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="attritionRate"
                    stroke="#10B981"
                    name="Attrition Rate %"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}