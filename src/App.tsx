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
import Table from "./components/Table";
import { useAppInit } from "./useAppInit";

function App() {
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const { loading, error } = useAppInit();
  const { user } = useAppState();

  if (error && !loading) {
    console.error("Error during app initialization:", error);
    return <div className="text-red-500">Error: {error}</div>;
  }
  

  return (
    <>
      {loading && <FullscreenLoader />}
      <Header />
      <div
        id="content"
        className="container  flex-grow flex flex-col items-center py-6 space-y-6 lg:px-0 px-4"
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
        <Table />
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
