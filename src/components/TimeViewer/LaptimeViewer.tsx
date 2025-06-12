import { useState, useEffect } from "react";
import { fetchLapTimes } from "../../supabase";
import Table from "./Table/Table";
import TableTabs from "./Table/TableTabs";
import { useAppState } from "../../StateProvider";
import Stats from "../Stats";
import CardViewer from "./Cards/CardViewer";

export default function LapTimeViewer() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

      const {
        user,
        viewedUserId,
        activeTrack,
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
          const times = await fetchLapTimes(
            viewedUserId || user.id,
            activeTrack.id,
          );
          if (times.error || !times.data) {
            setError(times.error ?? "Unknown error");
            setLapTimes([]);
          } else {
            setError(null);
            setLapTimes(times.data);
          }
          setLoading(false);
        }
    
        fetchData();
      }, [user, activeTrack.id, viewedUserId, setLapTimes]);

    return (
        <div className="w-full border border-gray-300 rounded-lg p-4 shadow-lg">
            <p>Lap Times</p>

            <Stats />
            <TableTabs />
            
            <div className="lg:block hidden">
                <Table error={error} loading={loading} />      
            </div>

            <div className="lg:hidden block">
                <CardViewer error={error} loading={loading} />
            </div>
        </div>
    );
}