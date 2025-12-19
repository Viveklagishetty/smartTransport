import React from 'react';

export const UserAvatar = ({ className = "h-12 w-12" }) => (
    <div className={`${className} rounded-full bg-blue-100 flex items-center justify-center text-blue-600`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2/3 h-2/3">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
        </svg>
    </div>
);

export const TruckAvatar = ({ className = "h-12 w-12" }) => (
    <div className={`${className} rounded-full bg-green-100 flex items-center justify-center text-green-600`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2/3 h-2/3">
            <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
            <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a.75.75 0 00-1.002-.548l-1.087.362a3.003 3.003 0 01-2.227-1.424l-3.355-1.916A4.478 4.478 0 0015.75 6.75z" />
        </svg>
    </div>
);
