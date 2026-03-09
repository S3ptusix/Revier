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

const hiringTrendsAnalysis = [
    {
        month: 'Jan',
        attritionRate: 15.2,
        employees: 450
    },
    {
        month: 'Fed',
        attritionRate: 14.8,
        employees: 468
    },
    {
        month: 'Mar',
        attritionRate: 13.5,
        employees: 489
    },
    {
        month: 'Apr',
        attritionRate: 12.9,
        employees: 512
    },
    {
        month: 'May',
        attritionRate: 12.1,
        employees: 538
    },
    {
        month: 'Jun',
        attritionRate: 11.7,
        employees: 567
    },
]

export default function AttritionRateTrendComponent() {
    return (
        <ResponsiveContainer width="100%" height="100%" >
            <LineChart data={hiringTrendsAnalysis}>
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <XAxis dataKey="month" />
                <CartesianGrid />

                <Tooltip />
                <Legend />


                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="attritionRate"
                  fill="#10B981"
                  name="Attrition Rate %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="employees"
                  fill="#3B82F6"
                  name="Total Employees"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}