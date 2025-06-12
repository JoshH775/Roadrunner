import { createClient } from "@supabase/supabase-js";
import type { Car, DBResponse, FilterType, Friend, LapTime, User } from "../types";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabasePublicKey = process.env.VITE_SUPABASE_PUBLIC_KEY || "";

export const supabase = createClient(supabaseUrl, supabasePublicKey);

async function asyncWrapper<T>(
  fn: () => Promise<DBResponse<T>>
): Promise<DBResponse<T>> {
  try {
    return await fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      data: null,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export const login = async (
  username: string,
  password: string
): Promise<DBResponse<User>> => {
  return asyncWrapper(async () => {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: `${username}@roadrunner.com`,
        password,
      });

    if (signInError || !signInData || !signInData.user) {
      console.warn("Sign in error:", signInError);
      return {
        data: null,
        error: "Failed to log in",
      };
    }

    return await fetchUserProfile(signInData.user.id);
  });
};

export const register = async (
  username: string,
  password: string
): Promise<DBResponse<User>> => {
  return asyncWrapper(async () => {
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: `${username}@roadrunner.com`,
        password: password,
      }
    );

    if (signUpError || !signUpData || !signUpData.user) {
      console.warn("Sign up error:", signUpError);
      return {
        data: null,
        error:
          signUpError?.code === "user_already_exists"
            ? "Username already exists. Please choose a different one."
            : "Failed to register",
      };
    }

    const { data, error } = await supabase
      .from("users")
      .insert({
        username,
        friend_code: generateFriendCode(),
        auth_user_id: signUpData.user.id,
      })
      .select("*")
      .single();

    if (error || !data) {
      console.warn("Error creating user profile:", error);
      await supabase.auth.admin.deleteUser(signUpData.user.id); // Clean up if user creation fails
      return {
        data: null,
        error: "Failed to create user profile",
      };
    }

    return {
      data: {
        id: data.id,
        username: data.username,
        friendCode: data.friend_code,
        friends: [],
      },
    };
  });
};

// For remember me functionality
export function fetchUserProfile(authUUID: string): Promise<DBResponse<User>> {
  return asyncWrapper(async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, friend_code")
      .eq("auth_user_id", authUUID)
      .single();

    if (error || !data) {
      console.warn("Error fetching user profile:", error);
      return {
        data: null,
        error: "Failed to fetch user profile",
      };
    }

    const { data: friendData } = await supabase
      .from("user_friends")
      .select("visible, friend:friend_id(id, username, friend_code)")
      .eq("user_id", data.id);

    const friendUsers: Friend[] = (friendData || [])
      //@ts-expect-error 2399 - TS thinks entry.friend is an array, but it's actually an object
      .map((entry) => ({ id: entry.friend.id, username: entry.friend.username, visible: entry.visible, friendCode: entry.friend.friend_code }))
      .flat();

    const userProfile: User = { id: data.id, username: data.username, friendCode: data.friend_code, friends: friendUsers };

    return {
      data: userProfile
    };
  });
}

function generateFriendCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}


export async function addFriend(userId: number, friendCode: string): Promise<DBResponse<{ id: number; username: string, friendCode: string }>> {
  return asyncWrapper(async () => {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("friend_code", friendCode)
      .single();

    if (userError || !userData) {
      console.warn("Error fetching user by friend code:", userError);
      return {
        data: null,
        error: "Friend code not found.",
      };
    }

    const { error: insertError } = await supabase
      .from("user_friends")
      .insert({
        user_id: userId,
        friend_id: userData.id,
      });

    if (insertError) {
      console.warn("Error adding friend:", insertError);
      return {
        data: null,
        error: insertError.code === "23505" // Unique violation
          ? "You are already friends with this user." : "Failed to add friend.",
      };
    }

    const { data: friendData, error: fetchError } = await supabase
      .from("users")
      .select("id, username, friend_code")
      .eq("id", userData.id)
      .single();

    if (fetchError || !friendData) {
      console.warn("Error fetching friend data:", fetchError);
      return {
        data: null,
        error:"Failed to fetch friend data.",
      };
    }

    return {
      data: {
        id: friendData.id,
        username: friendData.username,
        friendCode: friendData.friend_code,
      },
    };

    
  });
}

export async function addLapTime(
  lapTime: Omit<LapTime, "id" | "userId">,
  userId: number
) {
  return asyncWrapper(async () => {
    const lapTimeSnakeCase = {
      user_id: userId,
      car_id: lapTime.carId,
      track_id: lapTime.trackId,
      time: lapTime.time,
      pi: lapTime.pi,
      date: lapTime.date,
      engine_swap: lapTime.engineSwap,
      drivetrain_swap: lapTime.drivetrainSwap,
      flying_lap: lapTime.flyingLap,
    }

    const { data, error } = await supabase
      .from("lap_times")
      .insert(lapTimeSnakeCase)
      .select("*")
      .single();

    if (error || !data) {
      return {
        data: null,
        error: error?.message || "Failed to add lap time",
      };
    }

    return {
      data: {
        id: data.id,
        userId: data.user_id,
        carId: data.car_id,
        trackId: data.track_id,
        time: data.time,
        date: data.date,
        pi: data.pi,
        engineSwap: data.engine_swap,
        drivetrainSwap: data.drivetrain_swap,
        flyingLap: data.flying_lap,
      }
    };
  });
}

export async function toggleFriendVisibility(
  userId: number,
  friendId: number,
  visible: boolean
): Promise<DBResponse<void>> {
  return asyncWrapper(async () => {
    const { error } = await supabase
      .from("user_friends")
      .update({ visible })
      .eq("user_id", userId)
      .eq("friend_id", friendId);

    if (error) {
      return {
        data: null,
        error: error.message || "Failed to update friend visibility",
      };
    }

    return { data: undefined };
  });
}

export async function deleteFriend(
  userId: number,
  friendId: number
): Promise<DBResponse<void>> {
  return asyncWrapper(async () => {
    const { error } = await supabase
      .from("user_friends")
      .delete()
      .eq("user_id", userId)
      .eq("friend_id", friendId);

    if (error) {
      return {
        data: null,
        error: error.message || "Failed to delete friend",
      };
    }

    return { data: undefined };
  });
}

export async function fetchCars(): Promise<DBResponse<Car[]>> {
  return asyncWrapper(async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data) {
      console.warn("Error fetching cars:", error);
      return {
        data: [],
        error: "Failed to fetch cars",
      };
    }

    return {
      data: data as Car[],
    };
  });
}

const lapTimeCache: Record<string, LapTime[]> = {};

export async function invalidateLapTimeCache(userId: number, trackId: number): Promise<void> {
  const cacheKey = `${userId}-${trackId}`;
  if (lapTimeCache[cacheKey]) {
    delete lapTimeCache[cacheKey];
  }
}

export async function fetchLapTimes(userId: number, trackId: number): Promise<DBResponse<LapTime[]>> {
  return asyncWrapper(async () => {


    const cacheKey = `${userId}-${trackId}`;

    if (lapTimeCache[cacheKey]) {
      return { data: lapTimeCache[cacheKey] };
    }

    const query = supabase.from("lap_times")
      .select('*')
      .eq("track_id", trackId)
      .eq("user_id", userId)

    const { data, error } = await query;

    if (error || !data) {
      console.warn("Error fetching lap times:", error);
      return {
        data: [],
        error: "Failed to fetch lap times",
      };
    }

     // lap is a LapTime but snake case, hence the any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lapTimes: LapTime[] = data.map((lap: any) => ({
              id: lap.id,
              userId: lap.user_id,
              carId: lap.car_id,
              trackId: lap.track_id,
              time: lap.time,
              date: lap.date,
              pi: lap.pi,
              engineSwap: lap.engine_swap,
              drivetrainSwap: lap.drivetrain_swap,
              flyingLap: lap.flying_lap,
            }));
            
    lapTimeCache[cacheKey] = lapTimes;

    return {
      data: lapTimes
    }

  })
}

export function applyFilters(lapTimes: LapTime[], filters: FilterType, cars: Car[]): LapTime[] {
  return lapTimes.filter((lap) => {
    const carMatches = filters.carSearch === "" || cars.find(car => car.id === lap.carId)?.name.toLowerCase().includes(filters.carSearch.toLowerCase());
    const piMatches = filters.carClass.class === "all" || lap.pi >= filters.carClass.min && lap.pi <= filters.carClass.max;
    const modMatches = filters.modifications === "all" ||
      (filters.modifications === "engine" && lap.engineSwap) ||
      (filters.modifications === "drivetrain" && lap.drivetrainSwap) ||
      (filters.modifications === "both" && lap.engineSwap && lap.drivetrainSwap) ||
      (filters.modifications === "stock" && !lap.engineSwap && !lap.drivetrainSwap);

    return carMatches && piMatches && modMatches;
  })}