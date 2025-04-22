import React from 'react';

const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-sky-100 text-sky-800',
    outline: 'bg-transparent border border-gray-300 text-gray-800',
};

const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
};

const Tag = ({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    rounded = true,
    ...props
}) => {
    return (
        <span
            className={`inline-flex items-center font-medium ${rounded ? 'rounded-full' : 'rounded-md'
                } ${variantClasses[variant] || variantClasses.default} ${sizeClasses[size] || sizeClasses.md
                } ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export { Tag }; 