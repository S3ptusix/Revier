import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function JobsByIndustryComponent({ data = [] }) {

    return (
        <div className="bg-white border rounded-xl p-6 shadow-sm">
            <p className="font-semibold mb-4">Jobs by Industry</p>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}