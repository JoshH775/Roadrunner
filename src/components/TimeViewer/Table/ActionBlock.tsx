import { Trash2 } from "lucide-react";
import type { LapTime } from "../../../../types";
import Button from "../../UI/Button";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteLapTime } from "../../../supabase";
import { useAppState } from "../../../StateProvider";
import { YoutubeIcon } from "../../UI/CustomIcons";

type Props = {
  time: LapTime;
  mobile?: boolean;
};

export default function ActionBlock({ time, mobile = false }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    deleteLapTime: deleteLapTimeState,
    viewedUserId,
    user,
  } = useAppState();

  const handleDeleteLaptime = async (id: number) => {
    setLoading(true);
    toast.loading("Deleting lap time...");
    const { data, error } = await deleteLapTime(id);

    if (!data || error) {
      setLoading(false);
      toast.dismiss();
      toast.error(error?.message || "Failed to delete time.");
      return;
    }

    toast.dismiss();
    deleteLapTimeState(id);
    toast.success("Laptime deleted successfully!");
    setLoading(false);
  };

  const canDelete = viewedUserId === user?.id;
  const canViewVideo = !!time.videoUrl;

  if (!canDelete && !canViewVideo) {
    return (
      <span className="flex items-center justify-center text-center w-full">
        -
      </span>
    );
  }

  return (
    <div className={`flex items-center ${mobile ? "gap-1" : "gap-0"}`}>
      {canDelete && (
        <Button
          icon={<Trash2 className="w-5 text-gray-700" />}
          disabled={loading}
          onClick={() => {
            handleDeleteLaptime(time.id);
          }}
          className={mobile ? "!p-1" : ""}
        />
      )}
      {canViewVideo && (
        <a href={time.videoUrl!} target="_blank" rel="noopener noreferrer">
          <YoutubeIcon className="w-5 text-gray-700 cursor-pointer" />
        </a>
      )}
    </div>
  );
}
