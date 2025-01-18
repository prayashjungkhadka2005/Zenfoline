import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/outline';
import useAuthStore from '../store/userAuthStore'; 

const AdminHeader = () => {
    const username = useAuthStore((state) => state.username); 

    return (
        <header className="bg-white fixed top-0 left-64 w-[calc(100%-16rem)] z-10 shadow flex items-center justify-between px-6 py-4 border-b border-gray-300">
            <h1 className="text-xl font-semibold">
                Good morning, <span className="font-bold">{username}</span>
            </h1>

            <div className="flex items-center gap-6">
                <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />
                <UserCircleIcon className="w-8 h-8 text-gray-600 cursor-pointer" />
            </div>
        </header>
    );
};

export default AdminHeader;
