import PI from "../PI";
import { useSelect } from "downshift";
import Button from "../Button";
import { Award, ChevronsUpDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function ClassFilter() {
    const classes = [
        { name: 'all', label: 'All Classes', pi: 0 },
        { name: 'X',  label: 'X Class', pi: 999},
        { name: 'S2', label: 'S2 Class', pi: 998},
        {name: 'S1', label: 'S1 Class', pi: 900},
        { name: 'A', label: 'A Class', pi: 800},
        { name: 'B', label: 'B Class', pi: 700},
        { name: 'C', label: 'C Class', pi: 600},
        { name: 'D', label: 'D Class', pi: 500}]

        const { isOpen, getToggleButtonProps, getItemProps, getMenuProps, getLabelProps, selectedItem } = useSelect({
            items: classes,
            itemToString: (item) => item ? item.label : '',
            onSelectedItemChange: ({ selectedItem }) => {
                if (selectedItem) {
                    // Handle the selection change, e.g., update state or filters
                    console.log(`Selected class: ${selectedItem.name}`);
                }
            },
            initialSelectedItem: classes[0], // Default to 'All Classes'
        })

        return (
            <div className="relative lg:w-1/3 w-full">
            <label {...getLabelProps()} className="font-semibold flex"><Award className="mr-2 w-4"/>Class Filter</label>
            <Button {...getToggleButtonProps()} className="w-full flex items-center justify-between border !font-normal mt-1 border-gray-300  bg-white" icon={<ChevronsUpDown  />}>
                {selectedItem ? selectedItem.label : 'Select Class'}
             </Button>
             <AnimatePresence>
             {isOpen && <motion.div {...getMenuProps()} className="overscroll-contain absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1 max-h-45 overflow-y-scroll" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15, ease: "easeInOut" }}>
                {classes.map((item, index) => (
                    <div
                        key={`${item.name}-${index}`}
                        {...getItemProps({ item })}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    >
                        <span>{item.label}</span>
                        {item.name !== 'all' && <PI pi={item.pi} />}
                    </div>
                ))}

            </motion.div>}
            </AnimatePresence>
            </div>
             
        )
}