
import { Timer } from 'lucide-react'
import Button from './components/Button'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import Trackbar from './components/Trackbar'
import { useAppState } from './StateProvider'

import { useEffect } from 'react'

function App() {

    const { fetchCars } = useAppState()

    useEffect(() => {
        fetchCars()
    }, [fetchCars])

  return (
    <>
    <Header />
    <div id="content" className='container  flex-grow flex flex-col items-center py-6 space-y-6 lg:px-0 px-4'>
        <Trackbar />
        <FilterBar />
        <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white !justify-center !text-center font-bold py-3 px-6 !rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <Timer />
            Add Lap Time
        </Button>
    </div>
    </>
    )
}

export default App
