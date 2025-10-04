import React from 'react';

const alertStyles = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
};

const iconPaths = {
    success: 'M5 13l4 4L19 7',
    error: 'M6 18L18 6M6 6l12 12',
    warning: 'M12 9v2m0 4h.01',
}

function Alert({ type = 'error', message }) {
  if (!message) return null;

  return (
    <div
      className={`border px-4 py-3 rounded-md relative transition-all duration-300 ease-in-out transform animate-fade-in-down ${alertStyles[type]}`}
      role="alert"
    >
        <div className="flex items-center">
            <div className="py-1">
                <svg className="fill-current h-6 w-6 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPaths[type]} />
                </svg>
            </div>
            <div>
                <p className="font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    </div>
  );
}

export default Alert;
