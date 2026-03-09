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

const topCompaniesData = [
    { company: 'TechCorp Inc.', hires: 28, applications: 89 },
    { company: 'HealthPlus Medical', hires: 22, applications: 65 },
    { company: 'Finance Solutions', hires: 18, applications: 51 },
    { company: 'EduTech Learning', hires: 15, applications: 44 },
    { company: 'Retail Giants Co', hires: 12, applications: 38 },
];

export default function TopPerformingCompaniesComponent() {
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={topCompaniesData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="company" type="category" width={150} />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="hires"
                    fill="#10B981"
                    name="Hires"
                    radius={[0, 8, 8, 0]}
                />
                <Bar
                    dataKey="applications"
                    fill="#34d399"
                    name="Applications"
                    radius={[0, 8, 8, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}