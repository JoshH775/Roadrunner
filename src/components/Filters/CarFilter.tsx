import { Car } from "lucide-react";
import { useAppState } from "../../StateProvider";

export default function CarFilter() {
    const { filters, setFilters} = useAppState()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilters({ carSearch: value });
    };

    return (
    <div className="flex flex-col w-full">
        <label className="font-semibold flex">
            <Car className="mr-2 w-4" />
            Search Cars
        </label>
        <input
            type="text"
            placeholder="Search by make, model, or year"
            value={filters.carSearch}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
    </div>)
        
}