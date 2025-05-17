import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon, LogoutIcon, UserIcon, CreditCardIcon, CheckCircleIcon, BadgeCheckIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore'; // Add import for the auth store
import ProfileModal from '../components/ProfileModal';

const Header = () => {
    // Retrieve username dynamically from the store
    const username = useAuthStore((state) => state.user?.name || state.profile?.name || 'User'); 
    const logout = useAuthStore((state) => state.logout); // Get logout function
    const navigate = useNavigate(); // Initialize navigate
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    const handleLogout = () => {
        logout(); // Call the logout function from the store
        setIsProfileDropdownOpen(false);
        navigate('/login'); // Redirect to login page
        console.log("Logout clicked and user redirected");
    };

    const handleViewProfile = () => {
        setIsProfileDropdownOpen(false);
        setIsProfileModalOpen(true);
    };

    return (
        <>
            <header className="bg-white fixed top-0 left-60 w-[calc(100%-15rem)] z-10 shadow-sm flex items-center justify-between px-6 h-16 border-b border-gray-100">
                <h1 className="text-base font-medium text-gray-700">
                    Good morning, <span className="font-semibold text-gray-900">{username}</span>
                </h1>

                <div className="flex items-center gap-4">
                    {/* Profile Icon and Dropdown */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button 
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                            className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <UserCircleIcon className="w-6 h-6 text-gray-600" />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    View Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            
            {/* Profile Modal */}
            <ProfileModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
            />
        </>
    );
};

export default Header;
