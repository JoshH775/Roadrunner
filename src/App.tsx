
import FilterBar from './components/Filters/FilterBar'
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
    </div>
    </>
    )
}

export default App
