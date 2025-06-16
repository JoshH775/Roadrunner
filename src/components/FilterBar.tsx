import { Filter } from "lucide-react";
import Badge from "./UI/Badge";
import CarFilter from "./Filters/CarFilter";
import ClassFilter from "./Filters/ClassFilter";
import ModificationsFilter from "./Filters/ModificationsFilter";
import { useAppState } from "../StateProvider";
import type { ModificationOption, PIClass } from "../../types";

export default function FilterBar() {

    const { setFilters } = useAppState()

    const onModificationSelect = (modification: ModificationOption) => {
        setFilters({ modifications: modification });
    }

    const onClassSelect = (carClass: PIClass) => {
        setFilters({ carClass });
    }
    return (
        <div className="shadow-xl p-6 flex flex-col  rounded-lg w-full gap-4 bg-linear-to-r to-blue-500/13 from-purple-500/13 ">
            <div className="flex items-center gap-3">
            <Badge icon={<Filter className="text-white p-0" />} className="bg-linear-to-r from-red-500 to-pink-500 h-full" />
            <div>
                <p className="text-lg font-bold">Filters</p>
                <p className="text-gray-500">Select your preferences</p>
            </div>
            </div>
            <div id="filters" className="flex flex-col lg:flex-row w-full gap-4  items-center">
                <CarFilter />
                <ClassFilter onSelect={onClassSelect}/>
                <ModificationsFilter onSelect={onModificationSelect} />
            </div>

        </div>
    )
}