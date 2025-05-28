export type Car = {
    id: number;
    name: string;
    year: number;
    pi: number;
}

export type Track = {
    id: number;
    name: string;
    length: number; // Length in miles
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