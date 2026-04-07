import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Bar,
    Legend,
    BarChart

} from 'recharts';
import { jobsByIndustry } from '../services/reportsServices';
import { useEffect } from 'react';
import { useState } from 'react';

export default function JobsByIndustryComponent() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { success, message, totals } = await jobsByIndustry();
                if (success) return setData(totals)

                console.error(message);

            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={data}>
                <YAxis />
                <XAxis dataKey="industry" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="total"
                    fill="#10B981"
                    name="Active Jobs"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}