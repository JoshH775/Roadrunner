import React, { useEffect, useRef, useState } from "react";
import Modal from "../UI/Modal";
import { type Car, type LapTime, type Track } from "../../../types";
import TrackCombobox from "../TrackCombobox";
import Button from "../UI/Button";
import {
  Calendar,
  CarIcon,
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  DecimalsArrowRight,
  Route,
  Timer,
  Wrench,
} from "lucide-react";
import CarCombobox from "../CarCombobox";
import { useAppState } from "../../StateProvider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import toast from "react-hot-toast";
import { addLapTime, invalidateLapTimeCache } from "../../supabase";
import Input from "../UI/Input";
import { YoutubeIcon } from "../UI/CustomIcons";
dayjs.extend(duration);

export default function AddTimeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activeTrack, user, addLapTime: addLapTimeToState } = useAppState();

  const [extraOptions, setExtraOptions] = useState(false)

  useEffect(() => {
  if (isOpen) {
    setTrack(activeTrack);
    setLapTime((prev) => ({ ...prev, trackId: activeTrack.id }));
  }
}, [isOpen, activeTrack]);


  const [loading, setLoading] = useState(false);
  const [track, setTrack] = useState<Track>(activeTrack);
  const [car, setCar] = useState<Car | null>(null);
  const [lapTime, setLapTime] = useState<Omit<LapTime, "id" | "userId">>({
    time: 0,
    pi: 100,
    carId: car?.id || 0,
    trackId: track.id,
    date: dayjs().unix(),
    flyingLap: false,
    tuneCode: null,
    videoUrl: null,
  });

  const minutesRef = useRef<HTMLInputElement>(null);
  const secondsRef = useRef<HTMLInputElement>(null);
  const millisecondsRef = useRef<HTMLInputElement>(null);

  const carRef = useRef<HTMLButtonElement>(null);
  const piRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLDivElement>(null);
  const tuneCodeRef = useRef<HTMLInputElement>(null);
  const videoUrlRef = useRef<HTMLInputElement>(null);

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

  const onTuneCodeChange = (code: string) => {
    if (!(/^\d+$/.test(code))) {
      console.log('here')
      return
    }

    setLapTime((prev) => ({
      ...prev,
      tuneCode: code
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();

    if (!car || lapTime.carId === 0) {
      toast.error("Please select a car.");
      carRef.current?.focus();
      setLoading(false);
      return;
    }

    if (!track || lapTime.trackId === 0) {
      toast.error("Please select a track.");
      setLoading(false);
      return;
    }

    const minutes = Number(minutesRef.current?.value) || 0;
    const seconds = Number(secondsRef.current?.value) || 0;
    const milliseconds = Number(millisecondsRef.current?.value) || 0;

    if (minutes <= 0 && seconds <= 0) {
      toast.error("Minutes and seconds cannnot both be zero.");
      timeInputRef.current?.focus();
      setLoading(false);
      return;
    }

    if (minutes < 0 || seconds < 0 || milliseconds < 0) {
      toast.error("Time values cannot be negative.");
      timeInputRef.current?.focus();
      setLoading(false);
      return;
    }

    if (lapTime.pi < 100 || lapTime.pi > 999) {
      toast.error("Performance Index (PI) must be between 100 and 999.");
      piRef.current?.focus();
      setLoading(false);
      return;
    }

    if (lapTime.tuneCode && !(/^\d+$/.test(lapTime.tuneCode))) {
      toast.error("Tune code cannot contain non-numeric characters.")
      tuneCodeRef.current?.focus()
      setLoading(false)
      return
    }

    if (lapTime.tuneCode && (lapTime.tuneCode.length > 9 || lapTime.tuneCode.length < 9)) {
      toast.error("Tune code must be exactly 9 characters.")
      tuneCodeRef.current?.focus()
      setLoading(false)
      return
    }

    if (lapTime.videoUrl && !(/^https?:\/\/\S+\.\S+/.test(lapTime.videoUrl))) {
      toast.error("Link must be a valid URL.")
      videoUrlRef.current?.focus()
      setLoading(false)
      return
    }

    toast.loading("Saving lap time...")
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

    const { data, error } = await addLapTime(finalLapTime, user!.id);
    if (error || !data) {
      toast.dismiss();
      toast.error(error?.message || "Failed to add lap time.");
      setLoading(false);
      return;
    }


    addLapTimeToState(data);
    invalidateLapTimeCache(user!.id, track.id);
    toast.dismiss();
    toast.success("Lap time added!");
    setLoading(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Lap Time"
      classname="flex flex-col"
      icon={<Timer className="w-6" />}
      actions={[
        {
          label: "Save",
          variant: "primary",
          type: "submit",
          form: "add-lap-time-form",
          disabled: loading || user?.id === 10,
        },
        {
          label: "Cancel",
          onClick: onClose,
          variant: "secondary",
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
                className="w-full flex items-center flex-row-reverse justify-between border border-gray-300 !font-normal truncate !overflow-elipsis focus:ring-2 focus:ring-red-500"
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
              omitAllTracks
              renderButton={({ getToggleButtonProps }) => (
                <Button
                  className="w-full flex items-center justify-between flex-row-reverse border border-gray-300 !font-normal"
                  type="button"
                  icon={<ChevronsUpDown className="w-5" />}
                  {...getToggleButtonProps()}
                >
                  {track && track.id !== 0 ? track.name : "Select Track"}
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

        <button className="flex items-center gap-2 cursor-pointer p-2 pl-0 font-semibold text-sm" onClick={() => setExtraOptions(!extraOptions)} type="button">
          <p>Additional Options</p>
          {extraOptions ? <ChevronUp className="w-4" /> : <ChevronDown className="w-4" />}
        </button>

        {extraOptions && <Input
          ref={tuneCodeRef}
          label="Tune Code (optional)"
          placeholder="Enter tune code..."
          labelIcon={<Wrench  className="w-4"/>}
          labelClassName="text-sm"
          containerClassName="mt-0.5"
          minLength={9}
          maxLength={9}
          value={lapTime.tuneCode ?? ''}
          onChange={(e) => onTuneCodeChange(e.target.value)}
          type="numeric"
          />}

          {extraOptions && <Input
            ref={videoUrlRef}
            label="Video Link (optional)"
            placeholder="Enter video URL..."
            labelIcon={<YoutubeIcon className="w-4" />}
            labelClassName="text-sm"
            containerClassName="mt-2"
            value={lapTime.videoUrl ?? ''}
            onChange={(e) => setLapTime((prev) => ({...prev, videoUrl: e.target.value}))}
            />}
      </form>
    </Modal>
  );
}
