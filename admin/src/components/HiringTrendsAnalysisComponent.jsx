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

const hiringTrendsAnalysis = [
    {
        month: 'Jan',
        applications: 145,
        interviews: 89,
        hires: 34
    },
    {
        month: 'Fed',
        applications: 178,
        interviews: 102,
        hires: 42
    },
    {
        month: 'Mar',
        applications: 198,
        interviews: 118,
        hires: 51
    },
    {
        month: 'Apr',
        applications: 223,
        interviews: 134,
        hires: 58
    },
    {
        month: 'May',
        applications: 267,
        interviews: 156,
        hires: 67
    },
    {
        month: 'Jun',
        applications: 289,
        interviews: 178,
        hires: 78
    },
]

export default function HiringTrendsAnalysisComponent() {
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <AreaChart data={hiringTrendsAnalysis}>
                <YAxis />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />

                <Area
                    dataKey="applications"
                    name='Applications'
                    fill="#10B981"
                />
                <Area
                    dataKey="interviews"
                    name='Interviews'
                    fill="#3B82F6"
                />
                <Area
                    dataKey="hires"
                    name='Hires'
                    fill="#10B981"
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}