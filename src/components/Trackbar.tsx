import { MapPin, Timer, Route, ChevronsUpDown } from "lucide-react";
import Badge from "./UI/Badge";
import { useAppState } from "../StateProvider";
import TrackCombobox from "./TrackCombobox";
import Button from "./UI/Button";
import { useState } from "react";
import type { Track } from "../../types";

export default function Trackbar() {
  const { activeTrack: selectedTrack, setActiveTrack } = useAppState();
  const [trackButtonText, setTrackButtonText] = useState(
    "Choose your track..."
  );

  const handleTrackSelect = (track: Track) => {
    setTrackButtonText(track.name);
    setActiveTrack(track);
  };

  return (
    <div
      id="track-component"
      className="w-full flex lg:flex-row flex-col shadow-xl p-3.5 lg:p-6 gap-2 lg:gap-0 lg:justify-between items-center rounded-lg bg-linear-to-r from-blue-500/13 to-purple-500/13"
    >
      <div className="flex lg:gap-6 gap-3 items-center min-w-fit w-full lg:w-auto">
        <Badge
          icon={<MapPin className="text-white" />}
          className="bg-linear-to-r from-red-500 to-pink-500 !w-16 !h-16"
        />
        <div className="lg:space-y-2 space-y-1">
          <p className=" lg:text-2xl text-xl font-bold">{selectedTrack.name}</p>
          <div className="flex items-center gap-4 text-gray-500">
            <span className="flex items-center gap-2">
              <Timer className="w-4" />
              {selectedTrack.type === "circuit"
                ? "Circuit Race"
                : "Sprint Race"}
            </span>
            <span className="flex items-center gap-2">
              <Route className="w-4" />
              {selectedTrack.length.toFixed(1)} mi.
            </span>
          </div>
        </div>
      </div>
      <TrackCombobox
        onSelect={handleTrackSelect}
        className="lg:w-68"
        renderButton={({ getToggleButtonProps }) => (
          <Button
            className="border border-gray-300 text-gray-500 !flex-row-reverse bg-white w-full flex items-center justify-between"
            icon={<ChevronsUpDown className="w-5" />}
            {...getToggleButtonProps()}
          >
            {trackButtonText}
          </Button>
        )}
      />
    </div>
  );
}
