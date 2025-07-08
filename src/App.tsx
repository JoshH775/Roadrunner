import { Timer } from "lucide-react";
import Button from "./components/UI/Button";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import Trackbar from "./components/Trackbar";
import { useAppState } from "./StateProvider";

import { useState } from "react";
import AddTimeModal from "./components/Modals/AddTimeModal";
import AuthModal from "./components/Modals/AuthModal";
import FullscreenLoader from "./components/UI/FullscreenLoader";
import { useAppInit } from "./hooks/useAppInit";
import TimeViewer from "./components/TimeViewer/TimeViewer";

function App() {
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const { loading, error } = useAppInit();
  const { user } = useAppState();

if (error && !loading) {
  console.error("Error during app initialization:", error);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
        </svg>
        <h2 className="text-2xl font-semibold text-red-600 mb-2">Something went wrong</h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}
  

  return (
    <>
      {loading && <FullscreenLoader />}
      <Header />
      <div
        id="content"
        className="container  flex-grow flex flex-col items-center lg:py-6 py-3.5 gap-4 lg:px-0 px-4"
      >
        <Trackbar />
        <FilterBar />
        <Button
          variant="primary"
          className="w-full justify-center text-center rounded-xl shadow-lg  py-2.5"
          onClick={() => setShowAddTimeModal(true)}
        >
          <Timer />
          Add Lap Time
        </Button>


        {user && !loading && (<div className="w-full">
          <TimeViewer />
        </div>)}
        
      </div>
      <AddTimeModal
        isOpen={showAddTimeModal}
        onClose={() => setShowAddTimeModal(false)}
      />
      <AuthModal isOpen={!user && !loading} />
    </>
  );
}

export default App;
