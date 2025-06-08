import { useRef, useState } from "react";
import Modal from "../UI/Modal";
import { type Car, type LapTime, type Track } from "../../../types";
import TrackCombobox from "../TrackCombobox";
import Button from "../UI/Button";
import {
  Calendar,
  CarIcon,
  ChevronsUpDown,
  DecimalsArrowRight,
  Route,
  Timer,
} from "lucide-react";
import CarCombobox from "../CarCombobox";
import { useAppState } from "../../StateProvider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import toast from "react-hot-toast";
dayjs.extend(duration);

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
  const [lapTime, setLapTime] = useState<Omit<LapTime, "id">>({
    time: 0,
    pi: 100,
    carId: car?.id || 0,
    trackId: track.id,
    date: dayjs().unix(),
    userId: user?.id || 0,
    engineSwap: false,
    drivetrainSwap: false,
    flyingLap: false,
  });

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const millisecondsRef = useRef<HTMLInputElement>(null);

  const carRef = useRef<HTMLButtonElement>(null);
  const piRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLDivElement>(null);

  const onTrackSelect = (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setLapTime((prev) => ({ ...prev, trackId: selectedTrack.id }));
  };

  const onCarSelect = (selectedCar: Car) => {
    setCar(selectedCar);
    setLapTime((prev) => ({
      ...prev,
      carId: selectedCar.id,
      pi: selectedCar.pi,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!car || lapTime.carId === 0) {
      toast.error("Please select a car.");
      carRef.current?.focus();
      return;
    }

    if (!track || lapTime.trackId === 0) {
      toast.error("Please select a track.");
      return;
    }

    const minutes = Number(minutesRef.current?.value) || 0;
    const seconds = Number(secondsRef.current?.value) || 0;
    const milliseconds = Number(millisecondsRef.current?.value) || 0;

    if (minutes <= 0 && seconds <= 0) {
      toast.error("Minutes and seconds cannnot both be zero.");
      timeInputRef.current?.focus();
      return;
    }

    if (minutes < 0 || seconds < 0 || milliseconds < 0) {
      toast.error("Time values cannot be negative.");
      timeInputRef.current?.focus();

      return;
    }

    if (lapTime.pi < 100 || lapTime.pi > 999) {
      toast.error("Performance Index (PI) must be between 100 and 999.");
      piRef.current?.focus();
      return;
    }

    const totalTime = dayjs
      .duration({
        minutes,
        seconds,
        milliseconds,
      })
      .asMilliseconds();

    const finalLapTime = {
      ...lapTime,
      time: totalTime,
    };

    console.log("Submitting Lap Time:", finalLapTime);
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
      <form id="add-lap-time-form" onSubmit={onSubmit} noValidate>
        <div className="w-full h-full flex flex-col items-between col-span-2 mb-2">
          <label className="font-semibold mb-1 flex text-sm">
            <CarIcon className="w-4 mr-2" />
            Car
          </label>
          <CarCombobox
            onSelect={onCarSelect}
            renderButton={({ getToggleButtonProps }) => (
              <Button
                className="w-full flex items-center justify-between border border-gray-300 !font-normal truncate !overflow-elipsis focus:ring-2 focus:ring-red-500"
                type="button"
                ref={carRef}
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

        <div className="grid grid-cols-2 grid-rows-2 lg:gap-3 gap-2 place-items-center">
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

          <div className="w-full h-full flex flex-col items-between lg:col-span-1 col-span-2">
            <label className="font-semibold mb-1 flex text-sm">
              <Timer className="w-4 mr-2" />
              Lap Time
            </label>
            <div
              ref={timeInputRef}
              className="flex items-center space-x-1.5 lg:justify-start justify-between focus:ring-2 focus:ring-red-500 rounded-md p-0.5"
              tabIndex={-1}
            >
              <input
                type="number"
                ref={minutesRef}
                className=" w-full lg:w-16 border border-gray-300 rounded-md py-2 px-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="MM"
                required
                min={0}
              />
              <span>:</span>
              <input
                type="number"
                ref={secondsRef}
                className=" w-full lg:w-16 border border-gray-300 rounded-md py-2 px-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="SS"
                required
                min={0}
              />
              <span>:</span>
              <input
                type="number"
                ref={millisecondsRef}
                className=" w-full lg:w-16 border border-gray-300 rounded-md py-2 px-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ms"
                min={0}
                max={999}
              />
            </div>
          </div>

          <div className="w-full h-full flex flex-col items-between">
            <label className="font-semibold mb-1 flex text-sm">
              <Calendar className="w-4 mr-2" />
              Date
            </label>
            <input
              type="date"
              value={dayjs.unix(lapTime.date).format("YYYY-MM-DD")}
              required
              onChange={(e) =>
                setLapTime((prev) => ({
                  ...prev,
                  date: dayjs(e.target.value).unix(),
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
              ref={piRef}
              max={999}
              maxLength={3}
              required
              onChange={(e) =>
                setLapTime((prev) => ({ ...prev, pi: Number(e.target.value) }))
              }
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter Performance Index (PI)"
            />
          </div>
        </div>

        <div className="w-full h-full flex flex-col items-between mt-2">
          <label className="font-semibold mb-1 flex text-sm">
            Modifications & Settings
          </label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lapTime.engineSwap}
                onChange={(e) =>
                  setLapTime((prev) => ({
                    ...prev,
                    engineSwap: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded focus:ring-2 focus:ring-red-500 accent-red-500"
                title="Engine Swap"
              />
              <span className="font-semibold text-sm">Engine Swap</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lapTime.drivetrainSwap}
                onChange={(e) =>
                  setLapTime((prev) => ({
                    ...prev,
                    drivetrainSwap: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded focus:ring-2 focus:ring-red-500 accent-red-500"
                title="Drivetrain Swap"
              />
              <span className="font-semibold text-sm">Drivetrain Swap</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lapTime.flyingLap}
                onChange={(e) =>
                  setLapTime((prev) => ({
                    ...prev,
                    flyingLap: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded focus:ring-2 focus:ring-red-500 accent-red-500"
                title="Flying Lap"
              />
              <span className="font-semibold text-sm">
                Flying Lap (rolling start)
              </span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
