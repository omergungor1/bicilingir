import React from 'react';

export function SelectableCard({ selected, onClick, children, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-lg border-2 transition-all duration-200 flex items-center justify-between
        ${selected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
        }
        ${className}
      `}
    >
      <p className='text-sm font-medium'>{children}</p>
      <div className="">
        {selected ? (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
} 