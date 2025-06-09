import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
    icon?: React.ReactNode;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, onClick, className = '', icon, variant, disabled, ...rest }, ref) => {
        const defaultStyles = {
            primary: disabled
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600',
            secondary: disabled
                ? 'bg-gray-200 text-black'
                : 'bg-gray-200 text-black hover:bg-gray-300',
            danger: disabled
                ? 'bg-rose-600 text-white'
                : 'bg-rose-600 text-white hover:bg-rose-700',
        };

        return (
            <button
                ref={ref}
                onClick={onClick}
                className={clsx(
                    'flex gap-2 items-center cursor-pointer justify-between font-semibold px-4 py-2 h-fit rounded-md transition disabled:cursor-not-allowed disabled:opacity-80 disabled:saturate-50',
                    variant ? defaultStyles[variant] : undefined,
                    className
                )}
                disabled={disabled}
                {...rest}
            >
                {icon}
                {children}
            </button>
        );
    }
);

export default Button;