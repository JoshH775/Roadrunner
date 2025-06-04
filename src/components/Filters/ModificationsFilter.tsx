import { useSelect } from "downshift"
import Button from "../UI/Button";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsUpDown, Component } from "lucide-react";
import { useAppState } from "../../StateProvider";

export default function ModificationsFilter() {

    const {filters, setFilters} = useAppState()

    const options: { value: 'all' | 'engine' | 'drivetrain' | 'both' | 'stock', label: string }[] = [
        { value: 'all', label: 'All Modifications'},
        { value: 'engine', label: 'Engine Swap'},
        { value: 'drivetrain', label: 'Drivetrain Swap'},
        { value: 'both', label: 'Both'},
        { value: 'stock', label: 'Stock'}
    ]

    const { isOpen, getItemProps, getMenuProps, getLabelProps, getToggleButtonProps }  = useSelect({
        items: options,
        itemToString: (item) => item ? item.label : '',
        onSelectedItemChange: ({ selectedItem }) => {
            if (selectedItem) {
                setFilters({modifications: selectedItem.value})
            }
        },
    })

    return (
        <div className="relative w-full">
            <label {...getLabelProps()} className="font-semibold flex"><Component className="mr-2 w-4" />Modifications</label>
            <Button {...getToggleButtonProps()} className="w-full flex items-center justify-between border !font-normal mt-1 border-gray-300  bg-white" icon={<ChevronsUpDown />} >
                {filters.modifications === 'all' ? 'All Modifications' : options.find(option => option.value === filters.modifications)?.label || 'Select Modification'}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div {...getMenuProps()} className="absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}>
                        {options.map((item, index) => (
                            <div
                                key={`${item.value}-${index}`}
                                {...getItemProps({ item })}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {item.label}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}