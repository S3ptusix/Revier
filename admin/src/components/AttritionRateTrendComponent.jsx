import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function AttritionRateTrendComponent({ data = [] }) {

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="font-semibold mb-4">Attrition Rate (%)</p>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="attritionRate" stroke="#ef4444" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}