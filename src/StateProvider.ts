import { create } from "zustand";
import type { Car, LapTime, ProtoLapTime, Track, User } from "../types";
import { tracks } from "./tracks";
import { supabase } from "./supabase";

type State = {
    user: User | null;
    activeTrack: Track;
    selectedTabUserId: number | null;
    lapTimes: LapTime[]
    cars: Car[]
    loading: boolean;
    setUser: (user: User) => void;
    setActiveTrack: (track: Track) => void;
    setSelectedTabUserId: (userId: number) => void;

    addLapTime: (lapTime: ProtoLapTime) => void;
    deleteLapTime: (lapTimeId: number) => void;

    fetchTimesForUser: (userId: number) => Promise<void>;
    fetchCars: () => Promise<void>;
}



export const useAppState = create<State>((set, get) => ({
    user: null,
    activeTrack: tracks[0],
    selectedTabUserId: null,
    lapTimes: [],
    cars: [],
    loading: false,
    setUser: (user) => set({ user }),
    setActiveTrack: (track) => set({ activeTrack: track }),
    setSelectedTabUserId: (userId) => set({ selectedTabUserId: userId }),
    fetchTimesForUser: async (userId) => {
        try {
            set({ loading: true });
            const activeTrack = get().activeTrack;
            if (!activeTrack) return;
            const { data, error} = await supabase.from('lap_times').select('*').eq('user_id', userId).eq('track_id', activeTrack.id);
            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }
            set({ lapTimes: data || [] })
        } catch (error) {
            console.error("Error fetching lap times:", error);
        }
    set({ loading: false });

    },
    fetchCars: async () => {
        try {
            set({ loading: true });
            const { data, error } = await supabase.from('cars').select('*');
            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }
            set({ cars: data || [] });
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
        set({ loading: false });

    },
    addLapTime: async (lapTime: ProtoLapTime) => {
        const { user, activeTrack } = get();
        if (!user || !activeTrack) return;
        try {
            set({ loading: true });
            const { data, error } = await supabase.from('lap_times').insert({
                ...lapTime,
                user_id: user.id,
                track_id: activeTrack.id,
            }).select().single();

            if (error) {
                throw new Error(`Supabase error: ${error.message}`);
            }

            set((state) => ({
                lapTimes: [...state.lapTimes, data as LapTime],
            }));
        } catch (error) {
            console.error("Error adding lap time:", error);
        }
        set({ loading: false });
    },
    deleteLapTime: () => {},
    }))