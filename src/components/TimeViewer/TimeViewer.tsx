import { useState, useEffect } from "react";
import { applyFilters, fetchLapTimes } from "../../supabase";
import Table from "./Table/Table";
import { useAppState } from "../../StateProvider";
import Stats from "../StatsContainer";
import CardViewer from "./Cards/CardViewer";
import UserTabs from "../UserTabs";

export default function TimeViewer() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

      const {
        user,
        viewedUserId,
        activeTrack,
        filters,
        cars,
        setLapTimes,
      } = useAppState();

    useEffect(() => {
        async function fetchData() {
          if (!user) {
            setError("User not logged in");
            setLoading(false);
            return;
          }
    
          setLoading(true);
          const { data, error } = await fetchLapTimes(
            viewedUserId ?? user.id,
            activeTrack.id,
          );


          if (error || !data) {
            setError(error?.message ?? "Unknown error");
            setLapTimes([]);
          } else {
            setError(null);
            const times = await applyFilters(data, filters, cars)
            setLapTimes(times);
          }
          setLoading(false);
        }
    
        fetchData();
      }, [user, activeTrack.id, viewedUserId, setLapTimes, filters, cars]);

    return (
        <div className="w-full border border-gray-300 rounded-lg p-4 shadow-lg ">
            <p className="font-bold text-xl hidden lg:block">Lap Times</p>
            <p className="text-gray-500 mb-4 hidden lg:block">Click headers to sort - Use filters above to customise view</p>

            <Stats />
            <UserTabs />
            
            <div className="md:block hidden">
                <Table error={error} loading={loading} />      
            </div>

            <div className="md:hidden block">
                <CardViewer error={error} loading={loading} />
            </div>
        </div>
    );
}