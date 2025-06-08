import { useState } from "react";
import Modal from "../UI/Modal";
import {
    type Car,
  type LapTime,
  type ModificationOption,
  type Track,
} from "../../../types";
import TrackCombobox from "../TrackCombobox";
import Button from "../UI/Button";
import { Calendar, CarIcon, ChevronsUpDown, DecimalsArrowRight, Route } from "lucide-react";
import CarCombobox from "../CarCombobox";
import { useAppState } from "../../StateProvider";
import moment from "moment";

export default function AddTimeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {

    const { activeTrack, user } = useAppState();

  const [track, setTrack] = useState<Track>(activeTrack);
  const [car, setCar] = useState<Car | null>(null);
  const [lapTime, setLapTime] = useState<Omit<LapTime, 'id'>>({
    time: 0,
    pi: 100,
    carId: car?.id || 0,
    trackId: track.id,
    date: moment().unix(),
    userId: user?.id || 0,
    engineSwap: false,
    drivetrainSwap: false,
    flyingLap: false,
  });

  const onModSelect = (modification: ModificationOption) => {
    switch (modification) {
      case "engine":
        setLapTime((prev) => ({
          ...prev,
          engineSwap: true,
          drivetrainSwap: false,
        }));
        break;
      case "drivetrain":
        setLapTime((prev) => ({
          ...prev,
          engineSwap: false,
          drivetrainSwap: true,
        }));
        break;
      case "both":
        setLapTime((prev) => ({
          ...prev,
          engineSwap: true,
          drivetrainSwap: true,
        }));
        break;
      case "stock":
        setLapTime((prev) => ({
          ...prev,
          engineSwap: false,
          drivetrainSwap: false,
        }));
        break;
      default:
        setLapTime((prev) => ({
          ...prev,
          engineSwap: false,
          drivetrainSwap: false,
        }));
    }
  };

  const onTrackSelect = (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setLapTime((prev) => ({ ...prev, trackId: selectedTrack.id }));
  };

  const onCarSelect = (selectedCar: Car) => {
    setCar(selectedCar);
    setLapTime((prev) => ({ ...prev, carId: selectedCar.id }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lap Time"
      classname="flex flex-col"
      actions={[
        {
          label: "Save",
          variant: "primary",
          type: "submit",
          form: "add-lap-time-form",
        },
        {
          label: "Cancel",
          onClick: onClose,
          variant: "default",
        },
      ]}
    >
      <p className="text-gray-600 mb-2">Record your latest lap time here</p>
      <form id="add-lap-time-form" onSubmit={(e) => {console.log("Form submitted", e); e.preventDefault(); onClose();}}>

        <div className="grid grid-cols-2 grid-rows-2 lg:gap-4 gap-2 place-items-center">
        <div className="w-full h-full flex flex-col items-between col-span-2 lg:col-span-1">
          <label className="font-semibold mb-1 flex text-sm">
            <Route className="w-4 mr-2" />
            Track
          </label>
          <TrackCombobox
            onSelect={onTrackSelect}
            initialTrack={activeTrack}
            renderButton={({ getToggleButtonProps }) => (
              <Button
                className="w-full flex items-center justify-between border border-gray-300 !font-normal"
                type="button"
                icon={<ChevronsUpDown className="w-5" />}
                {...getToggleButtonProps()}
              >
                {track ? track.name : "Select Track"}
              </Button>
            )}
          />
        </div>

            <div className="w-full h-full flex flex-col items-between col-span-2 lg:col-span-1">
                <label className="font-semibold mb-1 flex text-sm"><CarIcon className="w-4 mr-2" />Car</label>
                <CarCombobox
                    onSelect={onCarSelect}
                    renderButton={({ getToggleButtonProps }) => (
                        <Button
                            className="w-full flex items-center justify-between border border-gray-300 !font-normal truncate !overflow-elipsis"
                            type="button"
                            icon={<ChevronsUpDown className="w-5" />}
                            {...getToggleButtonProps()}
                        >
                            <span className="truncate whitespace-nowrap overflow-hidden w-full text-left">
                                {car ? car.name : "Select Car"}
                            </span>
                        </Button>
                        )}
                />
                </div>

        <div className="w-full h-full flex flex-col items-between">
          <label className="font-semibold mb-1 flex text-sm"><Calendar className="w-4 mr-2" />Date</label>
          <input
            type="date"
            value={moment.unix(lapTime.date).format("YYYY-MM-DD")}
            required
            onChange={(e) =>
              setLapTime((prev) => ({
                ...prev,
                date: moment(e.target.value).unix(),
              }))
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Select Date"
            />
        </div>



        <div className="w-full h-full flex flex-col items-between">
          <label className="font-semibold mb-1 flex text-sm">
            <DecimalsArrowRight className="w-4 mr-2" />
            Performance Index
          </label>
          <input
            type="number"
            value={lapTime.pi}
            min={100}
            max={999}
            required
            onChange={(e) =>
              setLapTime((prev) => ({ ...prev, pi: Number(e.target.value) }))
            }
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter Performance Index"
          />
        </div>

        </div>

                
      </form>
      
    </Modal>
  );
}
