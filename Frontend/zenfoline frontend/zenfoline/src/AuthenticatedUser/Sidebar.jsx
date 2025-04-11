import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.png";

const Sidebar = () => {
    const menus = [
        { name: 'Home', path: '/dashboard', icon: 'fas fa-home', exact: true },
        { name: 'Templates', path: '/dashboard/templates', icon: 'fas fa-file-alt' },
        { name: 'Appearance', path: '/dashboard/themepage', icon: 'fas fa-paint-brush' },
        { name: 'Analytics', path: '/dashboard/analytics', icon: 'fas fa-chart-line' },
        { name: 'Settings', path: '/dashboard/settings', icon: 'fas fa-cog' },
    ];

    return (
        <div className="w-60 bg-white h-screen fixed flex flex-col shadow-md border-r border-gray-100">
            <div className="flex items-center justify-center h-16 border-b border-gray-100">
                <img src={logo} alt="Logo" className="h-7" />
            </div>

            <nav className="flex flex-col mt-4 px-3 space-y-1">
                {menus.map((menu) => (
                    <NavLink
                        key={menu.name}
                        to={menu.path}
                        end={menu.exact || false}
                        className={({ isActive }) =>
                            `flex items-center gap-3 py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                                isActive
                                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                            }`
                        }
                    >
                        <i className={`${menu.icon} text-base w-5 text-center ${menu.name === 'Home' && window.location.pathname === '/dashboard' ? 'text-orange-500' : ''}`}></i>
                        {menu.name}
                    </NavLink>
                ))}
            </nav>
            
            <div className="mt-auto p-4 border-t border-gray-100">
                <div className="flex items-center gap-3 py-2 px-3 text-sm text-gray-500 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                    <i className="fas fa-sign-out-alt text-base w-5 text-center"></i>
                    Logout
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
