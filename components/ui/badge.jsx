import React from 'react';

const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-purple-100 text-purple-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    light: 'bg-gray-100 text-gray-800',
    dark: 'bg-gray-700 text-white',
};

const solidVariantClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-purple-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-500 text-white',
    light: 'bg-gray-200 text-gray-800',
    dark: 'bg-gray-800 text-white',
};

const outlineVariantClasses = {
    primary: 'bg-transparent border border-blue-600 text-blue-600',
    secondary: 'bg-transparent border border-purple-600 text-purple-600',
    success: 'bg-transparent border border-green-600 text-green-600',
    danger: 'bg-transparent border border-red-600 text-red-600',
    warning: 'bg-transparent border border-yellow-600 text-yellow-600',
    info: 'bg-transparent border border-blue-500 text-blue-500',
    light: 'bg-transparent border border-gray-300 text-gray-600',
    dark: 'bg-transparent border border-gray-800 text-gray-800',
};

const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
};

const Badge = ({
    children,
    variant = 'primary',
    size = 'md',
    solid = false,
    outline = false,
    pill = false,
    icon,
    count,
    className = '',
    ...props
}) => {
    let styleClasses;

    if (outline) {
        styleClasses = outlineVariantClasses[variant] || outlineVariantClasses.primary;
    } else if (solid) {
        styleClasses = solidVariantClasses[variant] || solidVariantClasses.primary;
    } else {
        styleClasses = variantClasses[variant] || variantClasses.primary;
    }

    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const pillClass = pill ? 'rounded-full' : 'rounded';

    return (
        <span
            className={`inline-flex items-center font-medium ${styleClasses} ${sizeClass} ${pillClass} ${className}`}
            {...props}
        >
            {icon && <span className="mr-1">{icon}</span>}
            {children}
            {count !== undefined && (
                <span className={`ml-1 px-1 py-0.5 text-xs rounded-full bg-white bg-opacity-25`}>
                    {count}
                </span>
            )}
        </span>
    );
};

export { Badge }; 