import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/outline';

const Header = () => {
    const username = 'Prayash'; 

    return (
        <header className="bg-white fixed top-0 left-60 w-[calc(100%-15rem)] z-10 shadow-sm flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <h1 className="text-base font-medium text-gray-700">
                Good morning, <span className="font-semibold text-gray-900">{username}</span>
            </h1>

            <div className="flex items-center gap-4">
                <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <BellIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <UserCircleIcon className="w-6 h-6 text-gray-600" />
                </button>
            </div>
        </header>
    );
};

export default Header;
