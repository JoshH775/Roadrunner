import { Car } from "lucide-react";
import { useAppState } from "../../StateProvider";
import Input from "../UI/Input";

export default function CarFilter() {
  const { filters, setFilters } = useAppState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ carSearch: value });
  };

  return (
    <div className="flex flex-col w-full">
      <Input
        type="text"
        placeholder="Enter car name or model..."
        value={filters.carSearch}
        onChange={handleInputChange}
        className="mt-1 text-sm lg:text-base"
        label="Car Search"
        style={{backgroundColor: 'white'}}
        labelIcon={<Car className="mr-2 w-4" />}
      />
    </div>
  );
}
