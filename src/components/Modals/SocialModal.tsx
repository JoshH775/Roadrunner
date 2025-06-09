import { Copy, UserPlus } from "lucide-react"
import type { DefaultModalProps } from "../../../types"
import { useAppState } from "../../StateProvider"
import Button from "../UI/Button"
import Modal from "../UI/Modal"
import toast from "react-hot-toast"
import { addFriend } from "../../supabase"
import { useState } from "react"
import Input from "../UI/Input"


export default function SocialModal({ isOpen, onClose }: DefaultModalProps) {

    const { user } = useAppState()

    const [loading, setLoading] = useState(false);
    const [friendCode, setFriendCode] = useState("");

    if (!user) {
        return null; // or handle unauthenticated state
    }

    const handleCopy = async () => {
        if (!user?.friendCode) return;

        try {
            await navigator.clipboard.writeText(user.friendCode);
            toast.success("Copied!");
        } catch (error) {
            console.error("Failed to copy friend code:", error);
            toast.error("Failed to copy friend code.");
        }
    }


    const handleAddFriend = async () => {
        setLoading(true);
        if (!friendCode || friendCode.length < 8) {
            toast.error("Please enter a valid friend code.");
            setLoading(false);
            return;
        }

        const { data, error } = await addFriend(user?.id || 0, friendCode.toUpperCase());

        if (error && !data) {
            toast.error(error);
            setLoading(false);
            return;
        }

        if (data) {
            toast.success(`Added ${data.username} as a friend!`);
            setLoading(false);
            if (onClose) onClose();
        } else {
            toast.error("Failed to add friend.");
            setLoading(false);
        }
    }

// Z8OPS7TS

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Social Media"
            classname="space-y-4"
        >
            <p className="text-gray-500 font-semibold mb-1.5">Your Friend Code</p>
            <div className="flex border border-gray-300 rounded-lg p-4 items-center w-full justify-between">
                <span>
                    <p className="font-bold text-3xl">{user?.friendCode}</p>    
                    <p className="font-semibold text-gray-500">{user?.username}</p> 
                </span>
                <Button icon={<Copy className="w-4"/>} onClick={handleCopy} variant="secondary">
                    Copy
                </Button>
                
            </div>

            <p className="text-gray-500 font-semibold mb-1.5">Add Friend</p>
            <div className="flex flex-col border border-gray-300 rounded-lg p-4 gap-2  w-full justify-between">
                <Input label="Friend Code" placeholder="Enter friend's code" value={friendCode} onChange={(e) => setFriendCode(e.target.value.toUpperCase())} />
                <Button variant="primary" className="justify-center" onClick={handleAddFriend} icon={<UserPlus />} disabled={loading}>
                <p className="text-center">Add Friend</p></Button>
            </div>

            <p className="text-gray-500 font-semibold mb-1.5">Manage Friends</p>
            <div>
                {user?.friends.length > 0 && (
                    <ul className="space-y-2">
                        {user?.friends.map(friend => (
                            <li key={friend.id} className="flex items-center justify-between border border-gray-300 rounded-lg p-4">
                                <span>
                                    <p className="font-bold">{friend.username}</p>
                                    <p className="text-gray-500">{friend.friendCode}</p>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </Modal>
    )
}