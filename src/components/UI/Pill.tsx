type Props = {
    trueText: string;
    falseText: string;
    bool: boolean;
    className?: string;
}

export default function Pill({ trueText, falseText, bool, className = '' }: Props) {
    return (
        <div className={`rounded-full ${bool ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-500' : 'bg-white text-gray-800 border border-gray-300'} ${className}`}>
            <span className="px-3 py-1 text-sm font-semibold">
                {bool ? trueText : falseText}
            </span>
        </div>
    )
}