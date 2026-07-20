import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function HiringTrendsAnalysisComponent({ data = [] }) {

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="font-semibold mb-4">Hiring Trends</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}