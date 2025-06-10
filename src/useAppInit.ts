import { useEffect, useState } from "react";
import { useAppState } from "./StateProvider";
import { fetchCars, fetchUserProfile, supabase } from "./supabase";

export function useAppInit() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setCars, setUser, setLapTimes, setViewedUserId } = useAppState();

    useEffect(() => {
        async function init() {
            setLoading(true);

            // Fetch cars
            const { data: cars, error: carError } = await fetchCars();
            if (carError || !cars) {
                setError("Failed to fetch cars");
                setLoading(false);
                return;
            }
            setCars(cars);

            // Check if user is authenticated
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError) {
                // Log the auth error, but don’t treat it as a fatal error
                console.warn("Auth check failed:", authError.message);
            }

            if (authData?.user) {
                // Fetch user profile
                const { data: userProfile, error: profileError } = await fetchUserProfile(authData.user.id);
                if (profileError || !userProfile) {
                    setError("Failed to fetch user profile");
                    setLoading(false);
                    return;
                }
                setUser(userProfile);
                setViewedUserId(userProfile.id); // Set the viewed user to the logged-in user
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
