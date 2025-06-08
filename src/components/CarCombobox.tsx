import { useCombobox } from "downshift";
import type { Car } from "../../types";
import { useAppState } from "../StateProvider";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import PI from "./PI";
import { Search } from "lucide-react";

type Props = {
  onSelect: (car: Car) => void;
  className?: string;
  renderButton: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getToggleButtonProps: () => any;
  }) => React.ReactNode;
};

export default function CarCombobox({
  onSelect,
  className = "",
  renderButton,
}: Props) {
  const { cars } = useAppState();
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);

  const {
    getMenuProps,
    getItemProps,
    getInputProps,
    getToggleButtonProps,
    isOpen,
    inputValue,
  } = useCombobox({
    items: filteredCars,
    onInputValueChange: ({ inputValue }) => {
      const lowerInput = inputValue?.toLowerCase() || "";
      const filtered = cars.filter((car: Car) =>
        car.name.toLowerCase().includes(lowerInput)
      );
      setFilteredCars(filtered);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onSelect(selectedItem);
      }
    },

    itemToString: (item) => (item ? item.name : ""),
    stateReducer(_state, actionAndChanges) {
      const { type, changes } = actionAndChanges;
      if (type === useCombobox.stateChangeTypes.InputClick) {
        return { ...changes, isOpen: true };
      }
      return changes;
    },
  });

  const inputProps = getInputProps({}, { suppressRefError: true });
  const menuProps = getMenuProps({}, { suppressRefError: true });

  return (
    <div className={`relative w-full ${className}`}>
      {renderButton({
        getToggleButtonProps: () => getToggleButtonProps(),
      })}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white rounded-md absolute mt-1 z-10 overflow-scroll w-full shadow-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <span className="flex items-center justify-center gap-2 border-b border-gray-300 px-2">
              <Search className="text-gray-300 w-5" />
              <input
                placeholder="Search cars..."
                className="p-2 rounded outline-none w-full"
                {...inputProps}

              />
            </span>
            <ul
              {...menuProps}
              className="max-h-60 overflow-y-auto"
            >
              {isOpen && filteredCars.length === 0 && (
                <li className="p-2 text-gray-500 text-center">No cars found for "{inputValue}"</li>
              )}
              {isOpen &&
                filteredCars.map((car, index) => (
                  <li
                    key={car.id}
                    {...getItemProps({ item: car, index })}
                    className="p-2 flex cursor-pointer items-center justify-between"
                  >
                    <p>
                      {car.year} {car.name}
                    </p>
                    <PI pi={car.pi} />
                  </li>
                ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
