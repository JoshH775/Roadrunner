type Props = {
    trueText: string;
    falseText: string;
    bool: boolean;
    className?: string;
}

export default function Pill({ trueText, falseText, bool, className = '' }: Props) {
    return (
        <div className={`rounded-full text-center font-semibold flex items-center justify-center w-fit ${bool ? 'bg-linear-to-r from-red-500 to-pink-500 text-white border border-red-500' : 'bg-white text-gray-800 border border-gray-300'} ${className}`}>
            <span className="py-0.5 px-2.5 text-xs font-semibold">
                {bool ? trueText : falseText}
            </span>
        </div>
    )
}