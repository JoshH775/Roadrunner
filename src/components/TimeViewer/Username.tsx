import { useUsername } from "../../hooks/useUsername";

export default function Username({ userId, className ='' } : { userId: number, className?: string }) {
    const name = useUsername(userId)

    return (
        <p className={className}>{name || "Loading..."}</p>
    )
}