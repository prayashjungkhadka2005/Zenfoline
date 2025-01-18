import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './adminHeader';

const AdminDashboard = () => {
    return (
        <div className="flex h-screen">
            <AdminSidebar />

            <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
                <AdminHeader />

                <main
                    className="p-6 py-7 bg-gray-100 flex-1 overflow-auto"
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
