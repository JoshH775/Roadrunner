import { useSelect } from "downshift"
import Button from "../UI/Button";
import { AnimatePresence, motion } from "motion/react";
import { ChevronsUpDown, Component } from "lucide-react";
import type { ModificationOption } from "../../../types";

type Props = {
    onSelect: (modification: ModificationOption) => void;
    omitAll?: boolean;
}

export default function ModificationsFilter({ onSelect, omitAll = false }: Props) {

    const options: { value: ModificationOption, label: string }[] = [
        { value: 'stock', label: 'Stock'},
        { value: 'engine', label: 'Engine Swap'},
        { value: 'drivetrain', label: 'Drivetrain Swap'},
        { value: 'both', label: 'Both'}
    ]

    if (!omitAll) {
        options.unshift({ value: 'all', label: 'All Modifications' })
    }

    const { isOpen, getItemProps, getMenuProps, getLabelProps, getToggleButtonProps, selectedItem }  = useSelect({
        items: options,
        itemToString: (item) => item ? item.label : '',
        onSelectedItemChange: ({ selectedItem }) => onSelect(selectedItem?.value || 'stock'),
        initialSelectedItem: omitAll ? options[0] : null

    })

    const menuProps = getMenuProps({}, { suppressRefError: true });

    return (
        <div className="relative w-full text-sm lg:text-base">
            <label {...getLabelProps()} className="font-semibold flex"><Component className="mr-2 w-4" />Modifications</label>
            <Button {...getToggleButtonProps({type: "button"})} className="w-full flex flex-row-reverse items-center justify-between border !font-normal mt-1 border-gray-300  bg-white" icon={<ChevronsUpDown className="w-5"/>} >
                {selectedItem && selectedItem.label ? selectedItem.label : 'Select Modification'}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div {...menuProps} className="absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1"
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