import { createClient } from "@supabase/supabase-js";
import type { DBResponse, LapTime, User } from "../types";

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
      return {
        data: null,
        error: signInError?.message || "Failed to log in",
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
      return {
        data: null,
        error:
          signUpError?.code === "user_already_exists"
            ? "Username already exists. Please choose a different one."
            : signUpError?.message || "Failed to register",
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
      await supabase.auth.admin.deleteUser(signUpData.user.id); // Clean up if user creation fails
      return {
        data: null,
        error: error?.message || "Failed to create user profile",
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
      return {
        data: null,
        error: error?.message || "Failed to fetch user profile",
      };
    }

    const { data: friendData } = await supabase
      .from("user_friends")
      .select("friend:friend_id(id, username)")
      .eq("user_id", data.id);

    const friendUsers: { id: number; username: string }[] = (friendData || [])
      .map((entry) => entry.friend)
      .flat();

    return {
      data: {
        id: data.id,
        username: data.username,
        friendCode: data.friend_code,
        friends: friendUsers,
      },
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
      return {
        data: null,
        error: "Friend code not found",
      };
    }

    const { error: insertError } = await supabase
      .from("user_friends")
      .insert({
        user_id: userId,
        friend_id: userData.id,
      });

    if (insertError) {
      return {
        data: null,
        error: insertError.message || "Failed to add friend",
      };
    }

    const { data: friendData, error: fetchError } = await supabase
      .from("users")
      .select("id, username, friend_code")
      .eq("id", userData.id)
      .single();

    if (fetchError || !friendData) {
      return {
        data: null,
        error: fetchError?.message || "Failed to fetch friend data",
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

    console.log("Adding lap time:", lapTimeSnakeCase);
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
      data: data as LapTime,
    };
  });
}