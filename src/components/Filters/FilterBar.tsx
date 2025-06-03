import { Filter } from "lucide-react";
import Badge from "../Badge";

export default function FilterBar() {
    return (
        <div className="shadow-2xl p-6 flex items-center border border-gray-300 rounded-lg w-full ">
            <Badge icon={<Filter className="text-white p-0" />} className="bg-gradient-to-r from-red-500 to-pink-500 !w-10 !h-10" />
        </div>
    )
}