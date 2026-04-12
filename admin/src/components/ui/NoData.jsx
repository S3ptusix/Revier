import { SearchX } from "lucide-react";

export default function NoData({ message = 'No data available' }) {

    return (
        <div className="p-8 bg-gray-100 text-gray-500 h-full w-full flex-center flex-col gap-2">
            <SearchX size={32} />
            <p className="text-3xl">{message}</p>
        </div>
    )
}