import { useEffect, useState } from "react";
import { fetchUserById } from "../supabase";

export function useUsername(userId: number): string | null {
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await fetchUserById(userId);
            if (error) {
                console.error("Error fetching user:", error);
            } else {
                if (data?.username) {
                    setName(data.username)
                }
            }
        }

        fetchUser();
    })

    return name
}