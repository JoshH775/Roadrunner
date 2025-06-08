import { useRef, useState } from "react";
import { tracks as AllTracks } from "../tracks";
import type { Track } from "../../types";
import { MapPin, Search } from "lucide-react";
import { useCombobox } from "downshift";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";

type Props = {
  onSelect: (track: Track) => void;
  className?: string;
  initialTrack?: Track;
  renderButton: (props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getToggleButtonProps: () => any;
  }) => React.ReactNode;
}

export default function TrackCombobox({
  onSelect,
  className,
  renderButton,
    initialTrack,
}: Props) {
  const [tracks, setTracks] = useState(AllTracks);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    getMenuProps,
    isOpen,
    getItemProps,
    getInputProps,
    getToggleButtonProps,
    inputValue    
  } = useCombobox({
    items: tracks,
    onInputValueChange: ({ inputValue }) => {
      const filtered = AllTracks.filter((track: Track) =>
        track.name.toLowerCase().includes(inputValue?.toLowerCase() || "")
      );
      setTracks(filtered);
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
    initialSelectedItem: initialTrack || null,
  });

  const inputProps = getInputProps({ ref: inputRef }, { suppressRefError: true });
  const menuProps = getMenuProps({}, { suppressRefError: true });


  return (
    <div className={clsx("relative w-full", className)}>
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
                placeholder="Search tracks..."
                className="p-2 rounded outline-none w-full"
                {...inputProps}

              />
            </span>
            <ul className="max-h-60 overflow-y-auto" {...menuProps}>
              {isOpen &&
                tracks.length > 0 &&
                tracks.map((track, index) => (
                  <li
                    key={track.id}
                    {...getItemProps({ item: track, index })}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  >
                    <MapPin className="text-red-400 w-5" />
                    <p className="font-semibold">{track.name}</p>
                    <p className="text-gray-500">{track.length} mi.</p>
                  </li>
                ))}
              {isOpen && tracks.length === 0 && (
                <li className="p-2 text-gray-500 text-center">
                  No tracks found for "{inputValue}"
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
