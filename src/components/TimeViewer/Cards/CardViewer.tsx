import { useAppState } from "../../../StateProvider"
import { applyFilters } from "../../../supabase"
import Card from "./Card"

type Props = {
    error: string | null
    loading: boolean
}

export default function CardViewer({ error, loading }: Props) {

    const {
        lapTimes,
        filters,
        user,
        cars
    } = useAppState()

    const times = applyFilters(lapTimes, filters, cars)

    if (loading) {
        return (
            <div className="w-full">
            <div className="flex flex-col items-center justify-center w-full h-64 bg-white rounded-lg shadow-inner border border-gray-100 mt-4">
                <div className="relative w-14 h-14 mb-4">
                <span className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></span>
                <span className="absolute inset-2 rounded-full border-4 border-pink-400 border-b-transparent animate-spin"></span>
                </div>
                <span className="text-gray-700 text-lg font-semibold">
                Loading lap times...
                </span>
                <span className="text-gray-400 text-sm mt-1">
                Please wait while we fetch your data.
                </span>
            </div>
            </div>
        );
}

    return (
        <div className="flex flex-col w-full items-center gap-2">
            {times.map((time, idx) => (
                <Card time={time} index={idx} />
            ))}
        </div>
    )
}