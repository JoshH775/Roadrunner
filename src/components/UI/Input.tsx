import React from "react";

type Props = {
    label? : string;
    containerClassName?: string
    labelClassName?: string;
    labelIcon?: React.ReactNode;

} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, Props>(({ label, labelClassName = '', className, containerClassName, labelIcon, ...props }, ref) => {
    return (
        <div className={`flex flex-col ${containerClassName}`}>
            {label && <label className={"mb-1 font-semibold flex items-center gap-2 " + labelClassName}>{labelIcon}{label}</label>}
            <input
                ref={ref}
                className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${className}`}
                {...props}
            />
        </div>
    );
})

export default Input;