import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend

} from 'recharts';
import { hiringTrendsAnalysis } from '../services/reportsServices';
import { useEffect } from 'react';
import { useState } from 'react';

export default function HiringTrendsAnalysisComponent({ company = '', year = '' }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        try {
            const load = async () => {
                const { success, message, trends } = await hiringTrendsAnalysis({ companyId: company, year });
                if (success) return setData(trends);
                console.error(message);
            }

            load();
        } catch (error) {
            console.error(error);
        }
    }, [company, year]);

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <AreaChart data={data}>
                <YAxis />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Area
                    dataKey="New"
                    name='New'
                    fill="#3B82F6"
                />
                <Area
                    dataKey="Interview"
                    name='Interview'
                    fill="#F59E0B"
                />
                <Area
                    dataKey="Orientation"
                    name='Orientation'
                    fill="#8B5CF6"
                />
                <Area
                    dataKey="Hired"
                    name='Hired'
                    fill="#10B981"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}