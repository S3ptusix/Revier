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
import { attritionRateTrend } from '../services/reportsServices';

export default function AttritionRateTrendComponent({ company = '', year = '' }) {

    const [data, setData] = useState([]);
    
    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, trends } = await attritionRateTrend({ companyId: company, year });
                if (success) return setData(trends);
                console.error(message);
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