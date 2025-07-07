import { useMemo } from "react";
import { Globe, Trophy } from "lucide-react";
import type { Friend } from "../../types";
import { useAppState } from "../StateProvider";
import Button from "./UI/Button";

export default function UserTabs() {
  const { viewedUserId, setViewedUserId, user } = useAppState();

  const handleTabClick = (userId: number) => {
    setViewedUserId(userId);
  };

  const ids = useMemo(
    () => [
      user!.id,
      ...user!.friends
        .filter((friend: Friend) => friend.visible)
        .map((friend: Friend) => friend.id),
    ],
    [user]
  ); // A list containing the user and all the friend ids

  const Tab = ({ id, name }: { id: number; name: string }) => {
    const isActive = viewedUserId === id;
    const isSelf = id === user!.id;
    let icon = null;

    if (isSelf) {
      icon = <Trophy className="w-4" />;
    }

    if (id === 0) {
      icon = <Globe className="w-4" />;
    }

    if (isActive) {
      return (
        <Button variant="primary" icon={icon}>
          {" "}
          {isSelf ? "You" : name}
        </Button>
      );
    }

    return (
      <Button
        variant="secondary"
        className="bg-white text-gray-800"
        onClick={() => handleTabClick(id)}
        icon={icon}
      >
        {" "}
        {isSelf ? "You" : name}
      </Button>
    );
  };

  return (
    <div className=" bg-gray-200/75 p-1 rounded-lg flex mx-auto mb-2 overflow-x-scroll">
      <div className="flex mx-auto gap-2 w-fit">
        <Tab id={0} name="Global" />
        {ids.map((id) => {
          const friend = user!.friends.find((f: Friend) => f.id === id);
          return (
            <Tab
              key={id}
              id={id}
              name={friend ? friend.username : user!.username}
            />
          );
        })}
      </div>
    </div>
  );
}
