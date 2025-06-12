import type { Car, LapTime } from "../../types"
import { useAppState } from "../StateProvider"
import { applyFilters } from "../supabase"
import dayjs from "dayjs"
import { duration } from "dayjs"

// rounded-lg border bg-card text-card-foreground bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800 shadow-lg
//class="rounded-lg border bg-card text-card-foreground bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800 shadow-lg"
dayjs.extend(duration)

function Average({ averageLapTime }: { averageLapTime: number }) {
    return (
        <div className="w-full border p-8 rounded-lg bg-gradient-to-br shadow-lg from-yellow-100 to-amber-100 border-yellow-300 ">{dayjs.duration(Math.floor(averageLapTime), 'ms').format("mm:ss.SSS")}</div>   
    )
}

function FavoriteCar({ car } : { car?: Car }) {
    return (
        <div className="w-full border p-8 rounded-lg bg-gradient-to-br shadow-lg from-blue-100 to-indigo-100 border-blue-300">{car ? car.name : 'No favourite car'}</div>
    )
}

function FastestLap({ fastestLapTime } : { fastestLapTime?: LapTime}) {
    return (
        <div className="w-full border p-8 rounded-lg bg-gradient-to-br shadow-lg from-green-100 to-emerald-100 border-green-300">
            {fastestLapTime ? dayjs.duration(fastestLapTime.time, 'ms').format("mm:ss.SSS") : 'NA'}
        </div>
    )
}

function TotalLaps({ totalLaps }: { totalLaps: number }) {
    return (
        <div className="w-full border p-8 rounded-lg bg-gradient-to-br shadow-lg from-purple-100 to-violet-100 border-purple-300">{totalLaps} laps</div>
    )
    
}

export default function Stats() {

    const { lapTimes, cars, filters } = useAppState()

    const times = applyFilters(lapTimes, filters, cars)

    const averageLapTime = times.reduce((acc, time) => acc + time.time, 0) / times.length
    const totalLaps = times.length


    return (
         <div className="grid lg:grid-rows-1 grid-rows-2 lg:grid-cols-4 grid-cols-2 w-full gap-4 mb-4">
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