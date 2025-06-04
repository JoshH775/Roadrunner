import { MapPin, Timer, Route } from "lucide-react";
import Badge from "./UI/Badge";
import { useAppState } from "../StateProvider";
import  TrackSelector  from "./TrackSelector";

export default function Trackbar() {
    
    const selectedTrack = useAppState((state) => state.activeTrack)

    return (
        <div id="track-component" className='w-full flex lg:flex-row flex-col shadow-2xl p-4 lg:p-6 gap-2 lg:gap-0 lg:justify-between items-center rounded-lg bg-gradient-to-r from-blue-500/13 to-purple-500/13'>
            <div className="flex lg:gap-6 gap-3 items-center min-w-fit w-full lg:w-auto">
            <Badge icon={<MapPin className='text-white'/>} className='bg-gradient-to-r from-red-500 to-pink-500 !w-16 !h-16'/>
            <div className='space-y-2'>
                <p className=' lg:text-2xl text-xl font-bold'>{selectedTrack.name}</p>
                <div className='flex items-center gap-4 text-gray-500'>
                    <span className='flex items-center gap-2'>
                        <Timer className='w-4' />
                        {selectedTrack.type === 'circuit' ? 'Circuit Race' : 'Sprint Race'}
                    </span>
                    <span className='flex items-center gap-2'>
                        <Route className='w-4' />
                        {selectedTrack.length.toFixed(1)} mi.
                    </span>
                </div>
            </div>
            </div>
            <TrackSelector />
        </div>
    )
}

