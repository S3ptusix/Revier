import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,

} from 'recharts';

const applicantStatusData = [
    { name: 'Hired', value: 383, color: '#10b981' },
    { name: 'Interview', value: 213, color: '#3b82f6' },
    { name: 'Screening', value: 156, color: '#f59e0b' },
    { name: 'Rejected', value: 258, color: '#ef4444' },
];

export default function ApplicantStatusDistributionComponent() {
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <PieChart data={applicantStatusData}>

                <Tooltip />

                <Pie
                    data={applicantStatusData}
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {applicantStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>

            </PieChart>
        </ResponsiveContainer>
    )
}