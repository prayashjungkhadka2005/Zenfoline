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
                        <i className={`${menu.icon} text-base w-5 text-center`}></i>
                        {menu.name}
                    </NavLink>
                ))}
            </nav>
            
            <div className="mt-auto p-4 border-t border-gray-100">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2">
                    <i className="fas fa-crown text-xs"></i>
                    Upgrade Plan
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
