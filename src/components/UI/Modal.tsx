import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import Button, { type ButtonProps } from "./Button";
import { XIcon } from "lucide-react";

type ModalAction =  {
  label: string;
} & Omit<ButtonProps, "children">

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  icon?: React.ReactNode;
  classname?: string;
};

function ActionButton({ action }: { action: ModalAction }) {

  return (
    <Button
      {...action}
    >
      {action.label}
    </Button>
  );
}

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  icon = null,
  actions = [],
  classname = "",
}: ModalProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <motion.div
            id="modal-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            role="dialog"
            className={"relative bg-white lg:rounded-lg shadow-lg p-6 max-w-lg w-full " + classname}
          >
            {title && <div className="text-xl font-bold mb-2 flex justify-between items-center text-g">
              <span className="flex gap-2">
                {icon}{title}{" "}
              </span>
              {onClose && <button
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={onClose}
                aria-label="Close Modal"
              >
                <XIcon className="w-4" />
              </button>}
            </div>}
            {children}
            {actions.length > 0 && (
              <div className="mt-6 flex justify-end space-x-2">
                {actions.map((action, index) => (
                  <ActionButton key={index} action={action} />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.querySelector("#modal-root") || document.body
  );
}
