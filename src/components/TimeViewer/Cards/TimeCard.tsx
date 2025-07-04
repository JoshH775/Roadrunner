import type { LapTime } from "../../../../types";
import { useAppState } from "../../../StateProvider";
import PI from "../../PI";
import dayjs, { duration } from "dayjs";
import Pill from "../../UI/Pill";
import { tracks } from "../../../tracks";
import Button from "../../UI/Button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteLapTime } from "../../../supabase";

dayjs.extend(duration);

type Props = {
  time: LapTime;
  index: number;
};

export default function TimeCard({ time, index }: Props) {
  const {
    cars,
    activeTrack,
    user,
    viewedUserId,
    deleteLapTime: deleteLapTimeState,
  } = useAppState();

  const track =
    tracks.find((t) => t.id === time.trackId)?.name || "Unknown Track";

  const [actionLoading, setActionLoading] = useState(false);

  const handleDeleteLaptime = async () => {
    const id = time.id;
    setActionLoading(true);
    toast.loading("Deleting laptime...");

    const { data, error } = await deleteLapTime(id);

    toast.dismiss();

    if (!data || error) {
      toast.error("Failed to delete laptime.");
      setActionLoading(false);
      return;
    }

    deleteLapTimeState(id);
    toast.success("Successfully deleted laptime.");
    setActionLoading(false);
  };

  return (
    <div className="w-full border rounded-lg border-gray-300 p-4">
      {activeTrack.id == 0 && <span className="font-bold mb-1">{track}</span>}
      <span className="flex w-full items-center justify-between font-bold text-lg ">
        <p>#{index + 1}</p>
        <span className="flex items-center">
          {viewedUserId === user?.id && (
            <div className="flex items-center actions">
              <Button
                onClick={handleDeleteLaptime}
                disabled={actionLoading}
                icon={<Trash2 className="w-5 text-gray-500" />}
                className="!p-1"
              />
            </div>
          )}
          <PI pi={time.pi} />
        </span>
      </span>
      <p className="font-semibold text-xl">
        {cars.find((car) => car.id === time.carId)?.name || "Unknown Car"}
      </p>
      <span className="flex items-ceter justify-between text-gray-700">
        <p className=" font-mono text-lg font-semibold">
          {dayjs.duration(time.time, "ms").format("mm:ss.SSS")}
        </p>{" "}
        <p>{dayjs.unix(time.date).format("LL")}</p>
      </span>

      <div className="flex items-center w-full mt-3 gap-1.5">
        <Pill
          trueText="Engine Swap"
          falseText="Stock Engine"
          bool={time.engineSwap}
          className="truncate"
        />
        <Pill
          trueText="Drivetrain Swap"
          falseText="Stock Drivetrain"
          bool={time.drivetrainSwap}
          className="truncate"
        />
        <Pill
          trueText="Flying"
          falseText="Standing"
          bool={time.flyingLap}
          className="truncate"
        />
      </div>
    </div>
  );
}
