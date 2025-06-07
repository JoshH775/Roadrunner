import { useState } from "react";
import ClassFilter from "../Filters/ClassFilter";
import ModificationsFilter from "../Filters/ModificationsFilter";
import TrackSelector from "../TrackSelector";
import Modal from "../UI/Modal";
import type { LapTime } from "../../../types";

export default function AddTimeModal({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    
    const [lapTime, setLapTime] = useState<LapTime>({
        id: "",
        time: "",
        classId: "",
        modifications: [],
        trackId: "",
        date: new Date().toISOString(),
        userId: ""
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Lap Time"
            classname="flex flex-col"
            actions={[
                {
                    label: "Save",
                    onClick: () => {
                        // Handle save action
                        console.log("Lap time saved");
                        onClose();
                    },
                    variant: "primary"
                },
                {
                    label: "Cancel",
                    onClick: onClose,
                    variant: "default"
                }
            ]}
        >
                <p className="text-gray-600">Record your latest lap time here</p>
                <form className="grid grid-cols-2 grid-rows-2 gap-4">
                    <ClassFilter />
                    <ModificationsFilter />
                </form>
        </Modal>
    );

}