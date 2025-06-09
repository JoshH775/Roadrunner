import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { LapTime, User, Car } from '../../types'
import { useAppState } from "../StateProvider";
import PI from "./PI";
import dayjs, { duration } from "dayjs";
dayjs.extend(duration);

export default function Table() {
  const { user, cars } = useAppState();



  const cm = createColumnHelper<LapTime>();

  const columns = [
    cm.accessor("userId", {
      header: "User",
      cell: (info) => getUserById(info.getValue(), user),
    }),
    cm.accessor("carId", {
      header: "Car",
      cell: (info) => getCarById(info.getValue(), cars),
    }),
    cm.accessor("pi", {
      header: "PI",
      cell: (info) => <PI pi={info.getValue()} />,
    }),
    cm.accessor("time", {
      header: "Time",
      cell: (info) => dayjs.duration(info.getValue(), "ms").format("mm:ss.SSS"),
    }),
    cm.accessor("date", {
      header: "Date",
      cell: (info) => dayjs.unix(info.getValue()).format("YYYY-MM-DD"),
    }),
    cm.accessor("flyingLap", {
      header: "Flying Lap",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    cm.accessor("engineSwap", {
      header: "Engine Swap",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    cm.accessor("drivetrainSwap", {
      header: "Drivetrain Swap",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
  ];

  const table = useReactTable({
    data: laptimeDummyData,
    columns,
    getCoreRowModel: getCoreRowModel(),})

      if (!user) {
    return <div>Please log in to view the table.</div>;
  }

  return (
    <table className="w-full border border-gray-300 table-auto">
        <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id} className="px-4 py-2 border-b border-gray-200 text-left">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                    ))}
                </tr>))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-4 py-2 border-b border-gray-200">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
  );
}

const laptimeDummyData: LapTime[] = [
  {
    userId: 9,
    carId: 1,
    trackId: 1,
    time: 123456,
    date: 1700000000,
    pi: 800,
    engineSwap: false,
    drivetrainSwap: false,
    flyingLap: false,
    id: 1,
  },
];

function getUserById(userId: number, user: User | null) {
  // This function first checks if the id belongs to the current user.
  // If not, it searches the friends list for a matching user.
    if (!user) {
        return "Unknown User";
    }

  if (user.id === userId) {
    return user.username;
  }

  for (const friend of user.friends) {
    if (friend.id === userId) {
      return friend.username;
    }
  }

  return "Unknown User";
}

function getCarById(carId: number, cars: Car[]) {
  // This function retrieves the car name by its ID from the cars array.
  const car = cars.find((car) => car.id === carId);
  return car ? `${car.year} ${car.name}` : "Unknown Car";
}
