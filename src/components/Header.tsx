import { LogOutIcon, Users } from "lucide-react";
import Button from "./UI/Button";
import { useAppState } from "../StateProvider";
import SocialModal from "./Modals/SocialModal";
import { useState } from "react";
import Badge from "./UI/Badge";
import { LeaderboardIcon } from "./UI/CustomIcons";

export default function Header() {

  const { logout } = useAppState();
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  return (
    <header className="w-full border-b flex items-center justify-center border-gray-300 py-2 shadow-lg">
      <SocialModal isOpen={isSocialModalOpen} onClose={() => setIsSocialModalOpen(false)} />
      <div className="container flex gap-2 items-center justify-between lg:p-0 px-6">


        <div className="flex items-center gap-2">
          <Badge icon={<LeaderboardIcon className="fill-none text-white"/>} className="h-11 !p-1 bg-gradient-to-br from-red-500 to-pink-500" />
          <span>
              <p className="lg:text-2xl text-xl font-bold italic bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">Roadrunner</p>
              <p className="text-gray-500 font-semibold">Forza Horizon 5 Lap Time Tracker</p>
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-800">
                  <Button onClick={() => setIsSocialModalOpen(true)} icon={<Users className="w-4"/>}>
          Manage Friends
        </Button>
        <Button onClick={logout} icon={<LogOutIcon className="w-4"/>}>
          Logout
        </Button>
        </div>

      </div>
    </header>
  );
}
