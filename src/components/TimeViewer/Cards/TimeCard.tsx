import type { LapTime } from "../../../../types";
import { useAppState } from "../../../StateProvider";
import PI from "../../PI";
import dayjs, { duration } from "dayjs";
import Pill from "../../UI/Pill";
import { tracks } from "../../../tracks";
import Username from "../Username";
import ActionBlock from "../Table/ActionBlock";

dayjs.extend(duration);

type Props = {
  time: LapTime;
  index: number;
};

export default function TimeCard({ time, index }: Props) {
  const {
    cars,
    activeTrack,
    viewedUserId,
  } = useAppState();

  const track =
    tracks.find((t) => t.id === time.trackId)?.name || "Unknown Track";


  return (
    <div className="w-full border rounded-lg border-gray-300 p-4">
      {activeTrack.id == 0 && <span className="font-semibold mb-2 text-sm text-gray-700">{track}</span>}
      <span className="flex w-full items-center justify-between font-bold text-lg ">
        <span className="flex"><p>#{index + 1}</p>
        {viewedUserId === 0 && (
              <span className="flex gap-2 ml-2">
                -
               <Username userId={time.userId} />
               </span>
            )}
        </span>
          <PI pi={time.pi} />
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

      <div className="flex items-center w-full mt-3 justify-between">
        <div className="flex items-center gap-1.5">
        <Pill
          trueText="Flying"
          falseText="Standing"
          bool={time.flyingLap}
          className="truncate"
        />
        {time.tuneCode && <Pill
          trueText={time.tuneCode}
        falseText={time.tuneCode}
        bool={true}
        />}
        </div>
        <ActionBlock time={time} mobile/>
      </div>
    </div>
  );
}
