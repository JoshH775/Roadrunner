import {
  Copy,
  EyeIcon,
  EyeOffIcon,
  Trash2Icon,
  UserPlus,
  Users,
} from "lucide-react";
import type { DefaultModalProps } from "../../../types";
import { useAppState } from "../../StateProvider";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import toast from "react-hot-toast";
import { addFriend, deleteFriend } from "../../supabase";
import { useState } from "react";
import Input from "../UI/Input";
import { toggleFriendVisibility as dbToggleVisibility } from "../../supabase";

export default function SocialModal({ isOpen, onClose }: DefaultModalProps) {
  const { user, setUser } = useAppState();

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
  };

  const handleAddFriend = async () => {
    setLoading(true);
    if (!friendCode || friendCode.length < 8) {
      toast.error("Please enter a valid friend code.");
      setLoading(false);
      return;
    }

    const { data, error } = await addFriend(
      user?.id || 0,
      friendCode.toUpperCase()
    );

    if (error && !data) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      toast.success(`Added ${data.username} as a friend!`);
      setLoading(false);
      setFriendCode(""); 
    setUser({
        ...user,
        friends: [...user.friends, { ...data, visible: true }],
    });
    } else {
      toast.error("Failed to add friend.");
      setLoading(false);
    }
  };

  const toggleFriendVisibility = async (friendId: number, visible: boolean) => {
    setLoading(true);
    const { error } = await dbToggleVisibility(user.id, friendId, visible);

    if (error) {
      toast.error("Failed to update visibility.");
      setLoading(false);
      return;
    }

    setLoading(false);

    // Update local user state
    setUser({
      ...user,
      friends: user.friends.map((friend) =>
        friend.id === friendId ? { ...friend, visible: !visible } : friend
      ),
    });

    toast.success("Friend visibility updated.");
  };

  const removeFriend = async (friendId: number) => {
    setLoading(true);
    const { error } = await deleteFriend(user.id, friendId);
    if (error) {
      toast.error("Failed to remove friend.");
      setLoading(false);
      return;
    }

    setLoading(false);

    setUser({
      ...user,
      friends: user.friends.filter((friend) => friend.id !== friendId),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Friend Code & Friends"
      classname="space-y-4"
      icon={<Users className="w-6 h-6" />}
    >
    <p className="text-gray-600 mb-2">Share your code and manage friend visibility</p>

      <p className="text-gray-500 font-semibold mb-1.5">Your Friend Code</p>
      <div className="flex border border-gray-300 rounded-lg p-4 items-center w-full justify-between">
        <span>
          <p className="font-bold text-3xl">{user?.friendCode}</p>
          <p className="font-semibold text-gray-500">{user?.username}</p>
        </span>
        <Button
          icon={<Copy className="w-4" />}
          onClick={handleCopy}
          variant="secondary"
        >
          Copy
        </Button>
      </div>

      <p className="text-gray-500 font-semibold mb-1.5">Add Friend</p>
      <div className="flex flex-col border border-gray-300 rounded-lg p-4 gap-2  w-full justify-between">
        <Input
          label="Friend Code"
          placeholder="Enter friend's code"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value.toUpperCase())}
        />
        <Button
          variant="primary"
          className="justify-center"
          onClick={handleAddFriend}
          icon={<UserPlus />}
          disabled={loading}
        >
          <p className="text-center">Add Friend</p>
        </Button>
      </div>

      {user.friends.length > 0 && (
        <>
          <p className="text-gray-500 font-semibold mb-1.5">Manage Friends</p>
          <div>
            <ul className="space-y-2 max-h-75 overflow-y-scroll">
              {user?.friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center justify-between border border-gray-300 rounded-lg p-2 px-4"
                >
                  <span>
                    <p className="font-bold">{friend.username}</p>
                    <p className="text-gray-500">{friend.friendCode}</p>
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      icon={
                        friend.visible ? (
                          <EyeIcon className="w-6" />
                        ) : (
                          <EyeOffIcon className="w-6 opacity-50" />
                        )
                      }
                      onClick={() => {
                        toggleFriendVisibility(friend.id, friend.visible);
                      }}
                      className="!p-1"
                      disabled={loading}
                    />
                    <Button
                      icon={<Trash2Icon className="w-6 text-red-500" />}
                      onClick={() => {
                        removeFriend(friend.id);
                      }}
                      className="!p-1"
                      disabled={loading}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Modal>
  );
}
