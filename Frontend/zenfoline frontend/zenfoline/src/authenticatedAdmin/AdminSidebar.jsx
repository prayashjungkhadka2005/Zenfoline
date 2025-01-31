import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.png";

const AdminSiderbar = () => {
    const menus = [
        { name: 'Home', path: '/admindashboard', icon: 'fas fa-home', exact: true },
        { name: 'Templates', path: '/admindashboard/addtemplates', icon: 'fas fa-layer-group' }, // Represents templates or layouts
        { name: 'Components', path: '/admindashboard/managecomponents', icon: 'fas fa-cogs' }, // Represents settings or component management
    ];
    

    return (
        <div className="w-64 bg-white h-screen fixed flex flex-col shadow-md border-r border-gray-300">
            <div className="flex items-center justify-center py-3 border-b border-gray-300">
                <img src={logo} alt="Logo" className="h-10" />
            </div>

            <nav className="flex flex-col mt-4">
                {menus.map((menu) => (
                    <NavLink
                        key={menu.name}
                        to={menu.path}
                        end={menu.exact || false}
                        className={({ isActive }) =>
                            `flex items-center gap-4 py-3 px-4 mx-2 my-0.5 text-lg font-medium rounded-md ${
                                isActive
                                    ? 'bg-[#000042]/10 text-red font-bold'
                                    : 'text-[#686868] hover:bg-gray-100'
                            }`
                        }
                    >
                        <i className={`${menu.icon} text-lg`}></i>
                        {menu.name}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default AdminSiderbar;
