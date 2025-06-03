import { Filter } from "lucide-react";
import Badge from "./Badge";
import CarFilter from "./Filters/CarFilter";
import ClassFilter from "./Filters/ClassFilter";

export default function FilterBar() {
    return (
        <div className="shadow-2xl p-6 flex flex-col border border-gray-300 rounded-lg w-full gap-4 ">
            <div className="flex items-center gap-3">
            <Badge icon={<Filter className="text-white p-0" />} className="bg-gradient-to-r from-red-500 to-pink-500 h-full" />
            <div>
                <p className="text-lg font-bold">Filters</p>
                <p className="text-gray-500">Select your preferences</p>
            </div>
            </div>
            <div id="filters" className="flex flex-col lg:flex-row w-full gap-4  items-center">
                <CarFilter />
                <ClassFilter />
            </div>

        </div>
    )
}