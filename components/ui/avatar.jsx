import React from 'react';
import Image from 'next/image';

const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
};

const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    busy: 'bg-red-500',
    away: 'bg-yellow-500',
};

const colorClasses = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-purple-500 text-white',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-400 text-white',
    light: 'bg-gray-200 text-gray-800',
    dark: 'bg-gray-800 text-white',
};

const Avatar = ({
    src,
    alt = 'Avatar',
    size = 'md',
    initials,
    status,
    color = 'primary',
    className = '',
    rounded = true,
}) => {
    const baseClasses = "flex items-center justify-center flex-shrink-0 font-medium";
    const roundedClass = rounded ? 'rounded-full' : 'rounded-md';

    const getInitials = () => {
        if (initials) return initials;
        if (alt && typeof alt === 'string') {
            const words = alt.split(' ');
            if (words.length >= 2) {
                return `${words[0][0]}${words[1][0]}`.toUpperCase();
            }
            return alt.substring(0, 2).toUpperCase();
        }
        return '';
    };

    return (
        <div className="relative inline-block">
            {src ? (
                <div
                    className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${roundedClass} overflow-hidden ${className}`}
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : (
                <div
                    className={`
            ${baseClasses} 
            ${sizeClasses[size] || sizeClasses.md} 
            ${colorClasses[color] || colorClasses.primary} 
            ${roundedClass} 
            ${className}
          `}
                >
                    {getInitials()}
                </div>
            )}

            {status && (
                <span
                    className={`absolute bottom-0 right-0 block ${roundedClass} border-2 border-white ${statusClasses[status] || ''}`}
                    style={{
                        width: '30%',
                        height: '30%',
                        minWidth: '8px',
                        minHeight: '8px'
                    }}
                ></span>
            )}
        </div>
    );
};

export { Avatar }; 