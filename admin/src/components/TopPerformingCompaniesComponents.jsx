import { useEffect } from 'react';
import { useState } from 'react';
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
import { topPerformanceCompanies } from '../services/reportsServices';


export default function TopPerformingCompaniesComponent() {

    const [data, setData] = useState([]);
    useEffect(() => {
        const load = async () => {
            try {
                const { success, message, data } = await topPerformanceCompanies();
                if (success) return setData(data);
                console.error(message);

            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={data} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="companyName" type="category" width={150} />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="hiredCount"
                    fill="#10B981"
                    name="Hires"
                    radius={[0, 8, 8, 0]}
                />
                <Bar
                    dataKey="newCount"
                    fill="#34d399"
                    name="Applications"
                    radius={[0, 8, 8, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}