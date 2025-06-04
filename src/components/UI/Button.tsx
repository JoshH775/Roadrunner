export default function Button({
    children,
    onClick,
    className = '',
    icon,
    ...buttonProps
}: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    icon?: React.ReactNode;
    buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}) {
    return (
        <button
            onClick={onClick}
            className={`flex gap-2 items-center cursor-pointer justify-between font-semibold px-4 py-2 h-fit rounded-md transition ${className}`}
            {...buttonProps}
        >
            {children}
            {icon}
        </button>
    );
}