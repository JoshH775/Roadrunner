import type { Car, LapTime } from "../../types"
import { useAppState } from "../StateProvider"
import { applyFilters } from "../supabase"
import dayjs from "dayjs"
import { duration } from "dayjs"
import Badge from "./UI/Badge"
import { CarFront, ChartLine, Hash, Timer } from "lucide-react"

// rounded-lg border bg-card text-card-foreground bg-linear-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800 shadow-lg
//class="rounded-lg border bg-card text-card-foreground bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg"
dayjs.extend(duration)



function Average({ averageLapTime }: { averageLapTime: number }) {
  return (
    <div className="flex items-center gap-2 lg:gap-3 w-full border lg:p-5 p-3 rounded-lg bg-linear-to-br shadow-lg from-yellow-100 to-amber-100 border-yellow-300">
      <Badge icon={<ChartLine className="text-white" />} className="!p-2.5 w-10 h-10 bg-linear-to-r from-yellow-500 to-amber-500" />
      <div className="flex flex-col items-start justify-center w-full">
        <p className="text-yellow-700 text-sm lg:text-lg lg:font-semibold">Average</p>
        <p className="font-mono text-sm lg:text-xl font-semibold text-yellow-900">
          {!isNaN(averageLapTime) ? dayjs.duration(Math.floor(averageLapTime), "ms").format("mm:ss.SSS") : "0:00.000"}
        </p>
      </div>
    </div>
  );
}

function FavoriteCar({ car }: { car?: Car }) {
  return (
    <div className="flex items-center gap-2 lg:gap-3 w-full border lg:p-5 p-3 rounded-lg bg-linear-to-br shadow-lg from-blue-100 to-indigo-100 border-blue-300">
      <Badge icon={<CarFront className="text-white" />} className="!p-2.5 w-10 h-10 bg-linear-to-r from-blue-500 to-indigo-500" />
      <div className="flex flex-col items-start justify-center w-full">
        <p className="text-blue-700 text-sm lg:text-lg lg:font-semibold">Favorite Car</p>
        <p className="lg:text-xl text-sm font-semibold text-blue-900">
          {car ? car.name : "None"}
        </p>
      </div>
    </div>
  );
}

function FastestLap({ fastestLapTime }: { fastestLapTime?: LapTime }) {
  return (
    <div className="flex items-center gap-2 lg:gap-3 w-full border lg:p-5 p-3 rounded-lg bg-linear-to-br shadow-lg from-green-100 to-emerald-100 border-green-300">
      <Badge icon={<Timer className="text-white" />} className="!p-2.5 w-10 h-10 bg-linear-to-r from-green-500 to-emerald-500" />
      <div className="flex flex-col items-start justify-center w-full">
        <p className="text-green-700 text-sm lg:text-lg lg:font-semibold">Fastest Lap</p>
        <p className="font-mono lg:text-xl text-sm font-semibold text-green-900">
          {fastestLapTime ? dayjs.duration(fastestLapTime.time, "ms").format("mm:ss.SSS") : "0:00.000"}
        </p>
      </div>
    </div>
  );
}

function TotalLaps({ totalLaps }: { totalLaps: number }) {
  return (
    <div className="flex items-center gap-2 lg:gap-3 w-full border lg:p-5 p-3 rounded-lg bg-linear-to-br shadow-lg from-purple-100 to-violet-100 border-purple-300">
      <Badge icon={<Hash className="text-white" />} className="!p-2.5 w-10 h-10 bg-linear-to-r from-purple-500 to-violet-500" />
      <div className="flex flex-col items-start justify-center w-full">
        <p className="text-purple-700 text-sm lg:text-lg lg:font-semibold">Total Laps</p>
        <p className="lg:text-xl text-sm font-semibold text-purple-900">{totalLaps}</p>
      </div>
    </div>
  );
}


export default function Stats() {

    const { lapTimes, cars, filters } = useAppState()

    const times = applyFilters(lapTimes, filters, cars)

    const averageLapTime = times.reduce((acc, time) => acc + time.time, 0) / times.length
    const totalLaps = times.length


    return (
         <div className="grid lg:grid-rows-1 grid-rows-2 lg:grid-cols-4 grid-cols-2 w-full lg:gap-4 gap-2 mb-4">
            <Average averageLapTime={averageLapTime} />
            <FavoriteCar car={getFavouriteCar(times, cars)} />
            <FastestLap fastestLapTime={getFastestLap(times)} />
            <TotalLaps totalLaps={totalLaps} />
        </div>
    )
}

function getFavouriteCar(times: LapTime[], cars: Car[]) {
    const carCount: Record<number, number> = {};

    for (const lap of times) {
        if (carCount[lap.carId]) {
            carCount[lap.carId] += 1;
        } else {
            carCount[lap.carId] = 1;
        }
    }

    let max: number = 0;
    let favouriteCarId: number = 0;

    for (const [carId, count] of Object.entries(carCount)) {
        if (count > max) {
            max = count;
            favouriteCarId = parseInt(carId);
        }
    }

    return cars.find(car => car.id === favouriteCarId);
}

function getFastestLap(times: LapTime[]) {
    return times.reduce((fastest, current) => {
        return current.time < fastest.time ? current : fastest;
    }, times[0]);
}