import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
                <Header />

                <main
                    className="p-6 py-11 bg-gray-100 flex-1 overflow-auto"
                    style={{ marginTop: '2.5rem'}}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
