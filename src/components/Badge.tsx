type Props = {
    icon: React.ReactNode;
    className?: string;
};

export default function Badge({ icon, className = '' }: Props) {
    const baseClasses = "aspect-square rounded-xl text-bold grid place-items-center p-3 [&>*]:w-full [&>*]:h-full";
    return (
        <div className={`${baseClasses} ${className}`}>
            {icon}
        </div>
    );
}