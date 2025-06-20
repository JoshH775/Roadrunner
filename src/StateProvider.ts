import { create } from "zustand";
import type {
  Car,
  FilterType,
  LapTime,
  Track,
  User,
} from "../types";
import { tracks } from "./tracks";
import { supabase } from "./supabase";



type State = {
  user: User | null;
  activeTrack: Track;
  viewedUserId: number | null;
  lapTimes: LapTime[];
  cars: Car[];
  filters: FilterType;
  setUser: (user: User) => void;
  setActiveTrack: (track: Track) => void;
  setViewedUserId: (userId: number) => void;
  setFilters: (filters: Partial<FilterType>) => void;
  setCars: (cars: Car[]) => void;
  setLapTimes: (lapTimes: LapTime[]) => void;
  addLapTime: (lapTime: LapTime) => void;
  deleteLapTime: (lapTimeId: number) => void;
  logout: () => Promise<void>;
};

export const useAppState = create<State>((set, get) => {
  return {
    user: null,
    activeTrack: tracks[0],
    viewedUserId: null,
    lapTimes: [],
    cars: [],
    filters: {
      carSearch: "",
      carClass: { class: "all", color: "", min: 0, max: 9999 }, // Default to 'all' class
      modifications: "all",
    },
    setUser: (user) => set({ user }),
    setActiveTrack: (track) => set({ activeTrack: track }),
    setViewedUserId: (userId) => set({ viewedUserId: userId }),
    setCars: (cars) => set({ cars }),
    setLapTimes(lapTimes) {
      set({ lapTimes });
    },
    addLapTime: async (lapTime: LapTime) => {
      set({ lapTimes: [...get().lapTimes, lapTime] });
        },
        deleteLapTime: (lapTimeId: number) => {
      set((state) => ({
        lapTimes: state.lapTimes.filter((lt) => lt.id !== lapTimeId),
      }));
        },
        setFilters: (filters: Partial<FilterType>) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...filters,
        },
      })),
        logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        set({ user: null, lapTimes: [] });
        window.location.reload();
      }
    },
  };
});
