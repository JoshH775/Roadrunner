import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import type { LapTime, Car } from "../../../../types";
import { useAppState } from "../../../StateProvider";
import PI from "../../PI";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import duration from "dayjs/plugin/duration";
import { useMemo, useState } from "react";
import { applyFilters, deleteLapTime } from "../../../supabase";
import Pill from "../../UI/Pill";
import { tracks } from "../../../tracks";
import Button from "../../UI/Button";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
dayjs.extend(duration);
dayjs.extend(localizedFormat);

type Props = {
  error: string | null;
  loading: boolean;
}

export default function Table({ error, loading }: Props) {
  const {
    user,
    cars,
    filters,
    lapTimes,
    activeTrack,
    viewedUserId,
    deleteLapTime: deleteLapTimeState
  } = useAppState();

  //local loading state for actions
  const [actionLoading, setActionLoading] = useState(false)

  const cm = createColumnHelper<LapTime>();

  const columns = useMemo(
    () => {
      const baseColumns: ColumnDef<LapTime, any>[] = [
        cm.display({
          id: "#",
          header: "#",
          cell: (info) => (
            <span className="font-semibold">
              {info.row.index + 1}
            </span>
          ),
        }),
        cm.accessor("time", {
          header: "Time",
          cell: (info) =>
            <p className="font-semibold font-mono">{dayjs.duration(info.getValue(), "ms").format("mm:ss.SSS")}</p>,
        }),
        cm.accessor("carId", {
          header: "Car",
          cell: (info) => getCarById(info.getValue(), cars),
        }),
        cm.accessor("pi", {
          header: "PI",
          cell: (info) => <PI pi={info.getValue()} />,
        }),
        cm.accessor("date", {
          header: "Date",
          cell: (info) => dayjs.unix(info.getValue()).format("LL"),
        }),
        cm.accessor("flyingLap", {
          header: "Flying Lap",
          cell: (info) => <Pill trueText="Flying" falseText="Standing" bool={info.getValue()} className="truncate" />,
        }),
        cm.accessor("engineSwap", {
          header: "Engine Swap",
          cell: (info) => <Pill trueText="Engine Swap" falseText="Stock Engine" bool={info.getValue()} className="truncate" />,
        }),
        cm.accessor("drivetrainSwap", {
          header: "Drivetrain Swap",
          cell: (info) => <Pill trueText="Drivetrain Swap" falseText="Stock Drivetrain" bool={info.getValue()} className="truncate" />,
        }),
        
      ];

      if (activeTrack.id == 0) {
        baseColumns.splice(3, 0,
          cm.accessor("trackId", {
            header: "Track",
            cell: (info) => tracks.find(track => track.id === info.getValue())?.name || "Unknown Track",
          })
        );
      }

      if (viewedUserId === user?.id) {
        baseColumns.push(cm.display({
          id: "actions",
          header: "Actions",
          cell: (info) => {
            const time = info.row.original

            return (
              <Button icon={<Trash2 className="w-5 text-gray-700"/>} disabled={actionLoading} onClick={()=>{handleDeleteLaptime(time.id)}}/>
            )
          }
        }))
      }

      return baseColumns;
    },
    [cars, cm, activeTrack]
  );

  const handleDeleteLaptime = async (id: number) => {
    setActionLoading(true)
    toast.loading('Deleting lap time...')
    const { data, error } = await deleteLapTime(id)

    if (!data || error) {
      setActionLoading(false)
      toast.dismiss()
      toast.error(error?.message || 'Failed to delete time.')
      return
    }

    toast.dismiss()
    deleteLapTimeState(id)
    toast.success('Laptime deleted successfully!')
    setActionLoading(false)

  }

  const filteredLapTimes = useMemo(() => {
    return applyFilters(lapTimes, filters, cars);
  }, [lapTimes, filters, cars]);


  const table = useReactTable({
    data: filteredLapTimes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (!user) {
    return <div>Please log in to view the table.</div>;
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center w-full h-64 bg-white rounded-lg shadow-inner border border-gray-100 mt-4">
          <span className="text-red-500 text-lg font-semibold">{error}</span>
          <span className="text-gray-400 text-sm mt-1">
            Please try again later.
          </span>
        </div>
      </div>
    );
  }

if (loading) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center w-full h-64 bg-white rounded-lg shadow-inner border border-gray-100 mt-4">
        <div className="relative w-14 h-14 mb-4">
          <span className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></span>
          <span className="absolute inset-2 rounded-full border-4 border-pink-400 border-b-transparent animate-spin"></span>
        </div>
        <span className="text-gray-700 text-lg font-semibold">
          Loading lap times...
        </span>
        <span className="text-gray-400 text-sm mt-1">
          Please wait while we fetch your data.
        </span>
      </div>
    </div>
  );
}

  return (
    <div className="w-full">
      <div className="w-full max-w-full overflow-scroll p-0.5">
        <table className="w-full  border border-gray-300 table-auto rounded-xl">
          <thead className="bg-gray-200/75">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-gray-200 text-left"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} id={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b border-gray-200"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getCarById(carId: number, cars: Car[]) {
  // This function retrieves the car name by its ID from the cars array.
  // console.log("Searching for car with ID:", carId, "in cars list:", cars);
  const car = cars.find((car) => car.id === carId);
  return car ? `${car.year} ${car.name}` : "Unknown Car";
}

// function getUserById(targetUserId: number, user: User | null) {

//   if (user) {
//     const userList = [user, ...user.friends];
//   const userFound = userList.find((user) => user.id === targetUserId);
//   if (userFound) {
//     return userFound.username
//   }
// }

//   return "Unknown User";
// }