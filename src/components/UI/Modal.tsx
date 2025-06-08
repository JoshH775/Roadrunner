import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { XIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

type ModalAction =  {
  label: string;
  variant?: "default" | "danger" | "primary";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: ModalAction[];
  classname?: string;
};

function ActionButton({ action }: { action: ModalAction }) {
  const baseClasses =
    "px-4 py-2 rounded-md text-sm font-medium focus:outline-none";
  const variantClasses = {
    default: "bg-gray-200 text-black hover:bg-gray-300",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    primary:
      "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600",
  };

  return (
    <Button
      className={`${baseClasses} ${
        variantClasses[action.variant || "default"]
      }`}
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
            {title && <h2 className="text-xl font-bold mb-2 flex justify-between items-center text-g">
              {title}{" "}
              {onClose && <button
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={onClose}
                aria-label="Close Modal"
              >
                <XIcon className="w-4" />
              </button>}
            </h2>}
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
    document.body
  );
}
