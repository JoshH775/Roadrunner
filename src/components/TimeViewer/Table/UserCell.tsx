import { useEffect, useState } from "react";
import { fetchUserById } from "../../../supabase";

export default function UserCell({ userId }: { userId: number }) {


    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await fetchUserById(userId);
            if (error) {
                console.error("Error fetching user:", error);
            } else {
                setName(data?.username || "Unknown User");
            }
        }

        fetchUser();
    })

    return (
        <span className="font-semibold">
            {name || "Loading..."}
        </span>
    )
}