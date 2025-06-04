
import { Timer } from 'lucide-react'
import Button from './components/UI/Button'
import FilterBar from './components/FilterBar'
import Header from './components/Header'
import Trackbar from './components/Trackbar'
import { useAppState } from './StateProvider'

import { useEffect, useState } from 'react'
import Modal from './components/UI/Modal'
import AddTimeModal from './components/Modals/AddTimeModal'

function App() {

    const [showAddTimeModal, setShowAddTimeModal] = useState(false)
    const { fetchCars } = useAppState()

    console.log('App render')

    // Fetch cars when the app mounts
    useEffect(() => {
        fetchCars()
    }, [fetchCars])

  return (
    <>
    <Header />
    <div id="content" className='container  flex-grow flex flex-col items-center py-6 space-y-6 lg:px-0 px-4'>
        <Trackbar />
        <FilterBar />
        <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white !justify-center !text-center font-bold py-3 px-6 !rounded-xl shadow-lg hover:shadow-xl transition-colors duration-150 hover:from-red-600 hover:to-pink-600" onClick={() => setShowAddTimeModal(true)}>
            <Timer />
            Add Lap Time
        </Button>

    </div>
    <AddTimeModal isOpen={showAddTimeModal} onClose={() => setShowAddTimeModal(false)} />

    </>
    )
}

export default App
