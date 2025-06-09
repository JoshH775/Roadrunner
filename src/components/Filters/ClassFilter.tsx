import PI from "../PI";
import { useSelect } from "downshift";
import Button from "../UI/Button";
import { Award, ChevronsUpDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { piRanges as ranges, type PIClass } from "../../../types";

type Props = {
    onSelect: (selectedClass: PIClass) => void;
    omitAll?: boolean;
}


export default function ClassFilter({ onSelect, omitAll = false }: Props) {


        const all: PIClass = {
            class: 'all',
            min: 0,
            max: 9999,
            color: '' 
        }

        const piRanges = omitAll ? ranges : [all, ...ranges];

        const { isOpen, getToggleButtonProps, getItemProps, getMenuProps, getLabelProps, selectedItem } = useSelect({
            items: piRanges,
            itemToString: (item) => item ? `${item.class} Class` : '',
            onSelectedItemChange: ({ selectedItem }) => onSelect(selectedItem || all),
        })

        const menuProps = getMenuProps({}, { suppressRefError: true });
        

        return (
            <div className="relative w-full">
            <label {...getLabelProps()} className="font-semibold flex"><Award className="mr-2 w-4"/>Class Filter</label>
            <Button {...getToggleButtonProps({ type: 'button'})} className="w-full flex-row-reverse flex items-center justify-between border !font-normal mt-1 border-gray-300  bg-white" icon={<ChevronsUpDown  />}>
                {selectedItem
                    ? selectedItem.class === 'all'
                        ? 'All Classes'
                        : `${selectedItem.class} Class`
                    : 'Select Class'}
             </Button>
             <AnimatePresence>
             {isOpen && <motion.div {...menuProps} className="overscroll-contain absolute z-10 bg-white border w-full border-gray-300 rounded-md shadow-lg mt-1 max-h-45 overflow-y-scroll" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15, ease: "easeInOut" }}>
                {piRanges.map((item, index) => (
                    <div
                        key={`${item.class}-${index}`}
                        {...getItemProps({ item })}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    >
                        {item.class === 'all' ? (
                            <span>All Classes</span>
                        ) : <span>{item.class} Class</span>}
                        {item.class !== 'all' && <PI pi={item.max} />}
                    </div>
                ))}

            </motion.div>}
            </AnimatePresence>
            </div>
             
        )
}