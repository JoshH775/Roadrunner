import { createClient } from "@supabase/supabase-js";
import type { DBResponse, User } from "../types";

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
