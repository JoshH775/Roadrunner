import type { LapTime } from "../../../../types"
import { useAppState } from "../../../StateProvider"
import PI from "../../PI"
import dayjs, { duration } from 'dayjs'
import Pill from "../../UI/Pill"
dayjs.extend(duration)

type Props = {
    time: LapTime
    index: number
}

export default function Card({ time, index }: Props) {

    const { cars } = useAppState()

    return (
        <div className="w-full border rounded-lg border-gray-300 p-4">
            <span className="flex w-full items-center justify-between font-bold text-lg "><p>#{index+1}</p><PI pi={time.pi} /></span>
            <p className="font-semibold text-lg">{cars.find((car) => car.id === time.carId)?.name || 'Unknown Car'}</p>
            <span className="flex items-ceter justify-between"><p>{dayjs.duration(time.time, 'ms').format('mm:ss.SSS')}</p> <p>{dayjs.unix(time.date).format('YYYY-MM-DD')}</p></span>

            <div className="flex items-center w-full">
                <Pill trueText="Flying" falseText="Standing" bool={time.flyingLap} className="w-full" />
                <Pill trueText="Engine Swap" falseText="Stock Engine" bool={time.engineSwap} className="w-full" />
                <Pill trueText="Drivetrain Swap" falseText="Stock Drivetrain" bool={time.drivetrainSwap} className="w-full" />
            </div>
        </div>
    )
}