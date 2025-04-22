import React from 'react';

const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
};

const variantClasses = {
    primary: 'border-blue-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    success: 'border-green-600 border-t-transparent',
    danger: 'border-red-600 border-t-transparent',
    warning: 'border-yellow-600 border-t-transparent',
    info: 'border-sky-600 border-t-transparent',
};

const Loading = ({
    size = 'md',
    variant = 'primary',
    className = '',
    fullScreen = false,
    text,
    ...props
}) => {
    const spinner = (
        <div className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : ''}`}>
            <div
                className={`animate-spin rounded-full ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary
                    } ${className}`}
                {...props}
            ></div>
            {text && <p className="mt-2 text-gray-700">{text}</p>}
        </div>
    );

    return spinner;
};

export { Loading }; 