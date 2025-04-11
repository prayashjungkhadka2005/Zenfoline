import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/userAuthStore';
import axios from 'axios';
import { format } from 'date-fns';
import { UserCircleIcon } from '@heroicons/react/outline';

const ProfileModal = ({ isOpen, onClose }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = useAuthStore((state) => state.userId);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!userId) return;
            
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/authenticated-user/user/${userId}`);
                setUserDetails(response.data);
            } catch (err) {
                console.error('Error fetching user details:', err);
                setError('Failed to load user details');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchUserDetails();
        }
    }, [isOpen, userId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-white">Account Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-orange-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">{error}</div>
                    ) : userDetails ? (
                        <div className="space-y-6">
                            {/* Profile Header */}
                            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                                <div className="bg-orange-100 p-3 rounded-full">
                                    <UserCircleIcon className="h-12 w-12 text-orange-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{userDetails.email}</h3>
                                    <p className="text-sm text-gray-500">User ID: {userId}</p>
                                </div>
                            </div>

                            {/* Account Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Account Created</h4>
                                    <p className="text-gray-900">
                                        {format(new Date(userDetails.createdAt), 'PPP')}
                                    </p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Last Login</h4>
                                    <p className="text-gray-900">
                                        {format(new Date(userDetails.lastLogin), 'PPP p')}
                                    </p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Account Status</h4>
                                    <p className="mt-1">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            userDetails.status === 'active' ? 'bg-green-100 text-green-800' : 
                                            userDetails.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {userDetails.status.charAt(0).toUpperCase() + userDetails.status.slice(1)}
                                        </span>
                                    </p>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Active Template</h4>
                                    <p className="text-gray-900">
                                        {userDetails.selectedTemplate?.name || 'No template selected'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal; 