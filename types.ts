export type Car = {
    id: number;
    name: string;
    year: number;
    pi: number;
}

export type Track = {
    id: number;
    name: string;
    type: "circuit" | "sprint";
    length: number; // Length in miles
}

export type User = {
    id: number;
    username: string;
    friendCode: string;
    friends: User[];
}

export type LapTime = {
    id: number;
    userId: number;
    carId: number;
    trackId: number;
    time: number; // Time in ms
    date: number; //Unix timestamp
    pi: number;
    engineSwap: boolean;
    drivetrainSwap: boolean;
    flyingLap: boolean;
}

export type ProtoLapTime = Omit<LapTime, "id">;

export const piColors = {
    D: "#3dbaea",
    C: "#f6bf31",
    B: "#ff6533",
    A: "#fc355a",
    S1: "#bd5ee4",
    S2: "#1567d6",
    X: "#19A83C",
  };

export const piRanges = [
    { min: 100, max: 500, class: "D", color: piColors["D"] },
    { min: 501, max: 600, class: "C", color: piColors["C"] },
    { min: 601, max: 700, class: "B", color: piColors["B"] },
    { min: 701, max: 800, class: "A", color: piColors["A"] },
    { min: 801, max: 900, class: "S1", color: piColors["S1"] },
    { min: 901, max: 998, class: "S2", color: piColors["S2"] },
    { min: 999, max: 999, class: "X", color: piColors["X"] },
  ];

