/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import { fetchStatusDistribution } from '../services/reportsServices';

export default function ApplicantStatusDistributionComponent() {

    const colors = {
        new: '#3B82F6',
        interview: '#F59E0B',
        orientation: '#8B5CF6',
        hired: '#10B981',
        rejected: '#EF4444'
    };

    const [data, setData] = useState([
        { name: "new", value: 0, color: colors.new },
        { name: "interview", value: 0, color: colors.interview },
        { name: "orientation", value: 0, color: colors.orientation },
        { name: "hired", value: 0, color: colors.hired },
        { name: "rejected", value: 0, color: colors.rejected }
    ]);

    useEffect(() => {
        const load = async () => {
            try {
                const { success, message, totals } = await fetchStatusDistribution();

                if (!success) {
                    console.error(message);
                    return;
                }

                // Map totals object to chart data
                const formattedData = Object.entries(totals).map(([key, value]) => ({
                    name: key,
                    value: Number(value.percentage), // Use percentage, not the whole object
                    color: colors[key]
                }));

                setData(formattedData);

            } catch (error) {
                console.error(error);
            }
        };

        load();
    }, []);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>

                <Tooltip />

                <Pie
                    data={data}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>

            </PieChart>
        </ResponsiveContainer>
    );
}