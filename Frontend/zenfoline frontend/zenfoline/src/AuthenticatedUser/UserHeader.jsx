import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon, LogoutIcon, UserIcon, CreditCardIcon, CheckCircleIcon } from '@heroicons/react/outline';

const Header = () => {
    const username = 'Prayash'; 
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);
    const notificationDropdownRef = useRef(null);

    // Dummy notifications
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Payment received successfully!', type: 'payment', read: false, time: '2h ago' },
        { id: 2, message: 'Your account setup is complete.', type: 'account', read: false, time: '1d ago' },
        { id: 3, message: 'New template "Modern Dev" is available.', type: 'template', read: true, time: '3d ago' },
        { id: 4, message: 'Subscription renewal reminder.', type: 'billing', read: false, time: '5d ago' },
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    // Handle clicks outside the dropdowns to close them
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
            if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
                setIsNotificationDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Add your logout logic here
        console.log("Logout clicked");
        setIsProfileDropdownOpen(false);
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        console.log("Marked all as read");
        // Add logic to update backend later
        setIsNotificationDropdownOpen(false); // Optionally close dropdown
    };

    return (
        <header className="bg-white fixed top-0 left-60 w-[calc(100%-15rem)] z-10 shadow-sm flex items-center justify-between px-6 h-16 border-b border-gray-100">
            <h1 className="text-base font-medium text-gray-700">
                Good morning, <span className="font-semibold text-gray-900">{username}</span>
            </h1>

            <div className="flex items-center gap-4">
                {/* Notification Icon and Dropdown */}
                <div className="relative" ref={notificationDropdownRef}>
                    <button 
                        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                        className="relative p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <BellIcon className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 px-1 py-[1px] text-[8px] font-bold text-white ring-2 ring-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Menu */}
                    {isNotificationDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg z-20 border border-gray-100">
                            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-800">Notifications</h4>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-orange-500 hover:text-orange-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-b-0 ${notification.read ? 'bg-white' : 'bg-orange-50'} hover:bg-gray-100 transition-colors`}
                                        >
                                            {!notification.read && <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
                                            <div className={`flex-grow ${notification.read ? 'ml-[0.875rem]' : ''}`}>
                                                <p className="text-sm text-gray-700">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{notification.time}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 text-center px-4 py-6">No new notifications</p>
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-700">View all notifications</a>
                            </div>
                        </div>
                    )}
                </div>
                
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
                            <a
                                href="/dashboard/profile" // Update with actual profile path
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                                onClick={() => setIsProfileDropdownOpen(false)}
                            >
                                <UserIcon className="w-4 h-4" />
                                Profile
                            </a>
                            <a
                                href="/dashboard/plans" // Update with actual plans path
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                                onClick={() => setIsProfileDropdownOpen(false)}
                            >
                                <CreditCardIcon className="w-4 h-4" />
                                See Plans
                            </a>
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
    );
};

export default Header;
