import { Timer } from "lucide-react";
import Button from "./components/UI/Button";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import Trackbar from "./components/Trackbar";
import { useAppState } from "./StateProvider";

import { useEffect, useState } from "react";
import AddTimeModal from "./components/Modals/AddTimeModal";
import AuthModal from "./components/Modals/AuthModal";
import { fetchUserProfile, supabase } from "./supabase";
import FullscreenLoader from "./components/UI/FullscreenLoader";

function App() {
  const [showAddTimeModal, setShowAddTimeModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { fetchCars, user, setUser } = useAppState();

  useEffect(() => {
    async function init() {
      await fetchCars();

      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userProfile } = await fetchUserProfile(data.user.id);
        if (userProfile) {
          setUser(userProfile);
        }
      }

      setLoading(false);
    }

    init();
  }, [fetchCars, setUser]);

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
