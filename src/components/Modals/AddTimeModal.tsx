import ClassFilter from "../Filters/ClassFilter";
import TrackSelector from "../TrackSelector";
import Modal from "../UI/Modal";

export default function AddTimeModal({ isOpen, onClose }: {
    isOpen: boolean;
    onClose: () => void;
}) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add New Lap Time"
            classname="flex flex-col gap-4"
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
                    <TrackSelector />
                    <ClassFilter />
                </form>
        </Modal>
    );

}