import React, { forwardRef } from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    icon?: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, onClick, className = '', icon, ...rest }, ref) => {
        return (
            <button
                ref={ref}
                onClick={onClick}
                className={`flex gap-2 items-center cursor-pointer justify-between font-semibold px-4 py-2 h-fit rounded-md transition ${rest.disabled ? 'cursor-not-allowed' : ''} ${className}`}
                {...rest}
            >
                {children}
                {icon}
            </button>
        );
    }
);

export default Button;
