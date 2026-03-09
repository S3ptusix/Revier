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

const industries = [
    {
        industry: 'Technology',
        activeJobs: 45,
    },
    {
        industry: 'Healthcare',
        activeJobs: 32,
    },
    {
        industry: 'Finance',
        activeJobs: 28,
    },
    {
        industry: 'Education',
        activeJobs: 24,
    },
    {
        industry: 'Retail',
        activeJobs: 27,
    },
]

export default function JobsByIndustryComponent() {
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <BarChart data={industries}>
                <YAxis />
                <XAxis dataKey="industry" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Bar
                    dataKey="activeJobs"
                    fill="#10B981"
                    name="Active Jobs"
                    radius={[8, 8, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}