import { useEffect, useState } from "react";
import { useAppState } from "../StateProvider";
import { fetchCars, supabase, fetchUserProfile } from "../supabase";


export function useAppInit() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setCars, setUser, setLapTimes, setViewedUserId, setActiveTrack } = useAppState();

  useEffect(() => {
    async function init() {
      setLoading(true);

      const storageTrack = localStorage.getItem("activeTrack");
      if (storageTrack) {
        setActiveTrack(JSON.parse(storageTrack));
      }

      // Fetch cars
      const { data: cars, error: carError } = await fetchCars();
      if (carError || !cars) {
        setError("Failed to fetch cars");
        setLoading(false);
        return;
      }
      setCars(cars);

      // Check if user is authenticated
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError && authError.name !== "AuthSessionMissingError") {
        console.warn("Error fetching authentication data:", );
        setError(authError.message ?? "Failed to fetch authentication data");
        setLoading(false);
        return;
      }

      if (authData?.user) {
        // Fetch user profile
        const { data: userProfile, error: profileError } =
          await fetchUserProfile(authData.user.id);

        if (profileError || !userProfile) {
          if (profileError?.code === "PGRST116") {
            // User profile not found, set user to null
            setLoading(false);
            return;
          }

          setError(profileError?.message ?? "Failed to fetch user profile");
          setLoading(false);
          return;
        }
        


        setUser(userProfile);
        setViewedUserId(userProfile.id);
      }

      setLoading(false);
    }

    init();
  }, [setCars, setUser, setLapTimes, setViewedUserId]);

  return {
    loading,
    error,
  };
}
