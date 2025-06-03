import { useRef, useState } from "react";
import { useAppState } from "../StateProvider";
import { tracks as AllTracks } from "../tracks";
import type { Track } from "../../types";
import Button from "./Button";
import { ChevronsUpDown, MapPin, Search } from "lucide-react";
import { useCombobox } from "downshift";
import { motion, AnimatePresence } from "motion/react";


export default function TrackSelector() {
  const { setActiveTrack } = useAppState();
  const [inputValue, setInputValue] = useState("");
  const [tracks, setTracks] = useState(AllTracks); 
  const [buttonText, setButtonText] = useState("Choose your track...");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    getMenuProps,
    isOpen,
    getItemProps,
    getInputProps,
    getToggleButtonProps,
    openMenu,
  } = useCombobox({
    items: tracks,
    onInputValueChange: ({ inputValue }) => {
      setInputValue(inputValue || "");
      const filteredTracks = AllTracks.filter((track: Track) =>
        track.name.toLowerCase().includes(inputValue?.toLowerCase() || "")
      );
      setTracks(filteredTracks);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      setActiveTrack(selectedItem || AllTracks[0]);
        setButtonText(selectedItem ? selectedItem.name : "Choose your track...");
        setInputValue("")

    },
    itemToString: (item) => (item ? item.name : ""),
    stateReducer(_state, actionAndChanges) {
        const { type, changes } = actionAndChanges;
        if (type === useCombobox.stateChangeTypes.InputClick) {
            return {
                ...changes,
                isOpen: true, // Keep the menu open on input change
            };
        }
        return changes;
    },
  });

  return (
    <div className="relative lg:w-1/5 w-full shadow-2xl">
      <Button
        className="border border-gray-300 text-gray-500 bg-white w-full flex items-center justify-between"
        icon={<ChevronsUpDown className="w-5" />}
        {...getToggleButtonProps()}
      >
        {buttonText}
      </Button>
      <AnimatePresence>
      {isOpen && <motion.div
        className="bg-white  rounded-md absolute py-2 mt-1 z-10 overflow-scroll w-full  shadow-2xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <span className="flex items-center justify-center gap-2 border-b border-gray-300 px-2">
          <Search className="text-gray-300 w-5" />
          <input
            ref={inputRef}
            placeholder="Search for a track..."
            className=" p-2 rounded outline-none w-full "
            {...getInputProps({
              onFocus: () => {
                if (inputValue === "") {
                  openMenu();
                }
              },
            })}

          />
        </span>
        <ul className="max-h-60 overflow-y-auto" {...getMenuProps()}>
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
      </motion.div>}
    </AnimatePresence>

    </div>
  );
}
