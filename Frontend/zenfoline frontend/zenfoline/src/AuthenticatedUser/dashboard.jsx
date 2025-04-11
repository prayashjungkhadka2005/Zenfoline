import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './UserHeader';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col ml-60">
                <Header />

                <main className="flex-1 p-6 pt-20 overflow-auto">
                    <div className="max-w-7xl mx-auto px-1.5 py-1.5">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
