import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/userAuthStore';
import { FiLock, FiMail, FiUser, FiTrash2, FiAlertTriangle, FiCalendar, FiLogIn, FiShield } from 'react-icons/fi';
import Spinner from '../components/Spinner'; // Assuming Spinner component exists

// Define API Base URL if needed for real calls
const API_BASE_URL = 'http://localhost:3000'; 

const Setting = () => {
    // Select primitive values directly to stabilize dependencies
    const userId = useAuthStore((state) => state.userId);
    const storeUserEmail = useAuthStore((state) => state.user?.email); // Keep store email as fallback

    // Profile Data State - Expanded to hold more details
    const [profileData, setProfileData] = useState({
        email: '',
        createdAt: '',
        lastLogin: '',
        status: '' 
    });
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // Form States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');

    const [passwordLoading, setPasswordLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch Profile Data from the correct endpoint
    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) {
                setProfileLoading(false);
                setProfileError('User not found');
                return;
            }
            setProfileLoading(true);
            setProfileError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/authenticated-user/user/${userId}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); 
                    throw new Error(errorData.message || `Failed to fetch profile (${response.status})`);
                }
                const data = await response.json();
                console.log("Fetched profile data:", data);
                setProfileData({
                    email: data.email || storeUserEmail || 'N/A',
                    createdAt: data.createdAt,
                    lastLogin: data.lastLogin,
                    status: data.status || 'unknown'
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                setProfileError(err.message || 'Could not load profile data.');
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, [userId, storeUserEmail]); // Corrected dependencies

    // Placeholder for API calls
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        if (newPassword.length < 6) { // Basic validation
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }
        setPasswordLoading(true);
        console.log('Changing password...', { userId, currentPassword: '***', newPassword: '***' });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        // Replace with actual API call: POST /api/user/change-password
        // Handle success/error from API
        setPasswordLoading(false);
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' }); 
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Example error: setPasswordMessage({ type: 'error', text: 'Incorrect current password.' });
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        setEmailMessage({ type: '', text: '' });
        if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) { // Basic validation
             setEmailMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }
        setEmailLoading(true);
        console.log('Changing email...', { userId, newEmail });
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Replace with actual API call: POST /api/user/change-email
        // Handle success (e.g., email sent for verification) / error
        setEmailLoading(false);
        setEmailMessage({ type: 'success', text: 'Verification email sent to new address.' });
        setNewEmail('');
        // Example error: setEmailMessage({ type: 'error', text: 'Email already in use.' });
    };

    const handleDeleteAccount = async () => {
        // Double-check confirmation email matches
        if (deleteConfirmEmail !== storeUserEmail) {
            alert('Confirmation email does not match.'); // Simple alert for now
            return;
        }
        setDeleteLoading(true);
        try {
            console.log('Deleting account...', { userId });
            // Replace with actual API call: DELETE /api/user/delete-account
            await new Promise(resolve => setTimeout(resolve, 2000));
            // const response = await fetch(`${API_BASE_URL}/api/user/delete-account`, { method: 'DELETE', ... });
            // if (!response.ok) { throw new Error('Failed to delete account'); }
            
            console.log('Account deleted (simulation)');
            // On actual success:
            // useAuthStore.getState().logout(); 
            // navigate('/login'); // Need to import useNavigate from react-router-dom
            alert('Account deleted successfully (simulation). You would be logged out now.');
            setShowDeleteConfirm(false); // Hide confirm section after simulated success

        } catch (err) {
            console.error("Error deleting account:", err);
             alert(err.message || 'Could not delete account.'); // Simple alert for error
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Account Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account details and security.</p>
            </div>

            {/* Account Overview Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUser className="w-5 h-5 text-orange-500" /> Account Overview
                </h2>
                {profileLoading ? (
                    <div className="flex justify-center items-center min-h-[80px]">
                        <Spinner size="sm" color="orange-500" />
                    </div>
                ) : profileError ? (
                    <p className="text-red-600 text-sm">{profileError}</p>
                ) : (
                    <div className="space-y-4 text-sm">
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-500 flex items-center gap-1.5"><FiMail className='w-4 h-4'/> Email:</span>
                            <span className="text-gray-700">{profileData.email}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-500 flex items-center gap-1.5"><FiCalendar className='w-4 h-4'/> Joined:</span>
                            <span className="text-gray-700">{new Date(profileData.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-500 flex items-center gap-1.5"><FiLogIn className='w-4 h-4'/> Last Login:</span>
                            <span className="text-gray-700">{new Date(profileData.lastLogin).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="w-32 font-medium text-gray-500 flex items-center gap-1.5"><FiShield className='w-4 h-4'/> Status:</span>
                             <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ profileData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800' }`}>
                                {profileData.status}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiLock className="w-5 h-5 text-orange-500" /> Change Password
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Enter your current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input 
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Enter new password (min. 6 characters)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input 
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Confirm your new password"
                        />
                    </div>
                    {passwordMessage.text && (
                        <p className={`text-sm ${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {passwordMessage.text}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={passwordLoading}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                        {passwordLoading ? <Spinner size="sm" color="white" className="mr-2"/> : null}
                        {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>

            {/* Change Email Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiMail className="w-5 h-5 text-orange-500" /> Change Email Address
                </h2>
                <form onSubmit={handleChangeEmail} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Email Address</label>
                        <input 
                            type="email" 
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                            placeholder="Enter your new email address"
                        />
                    </div>
                     <p className="text-xs text-gray-500">A verification link will be sent to your new email address.</p>
                     {emailMessage.text && (
                        <p className={`text-sm ${emailMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {emailMessage.text}
                        </p>
                    )}
                    <button 
                        type="submit"
                        disabled={emailLoading}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                    >
                         {emailLoading ? <Spinner size="sm" color="white" className="mr-2"/> : null}
                         {emailLoading ? 'Sending...' : 'Update Email'}
                    </button>
                </form>
            </div>

            {/* Delete Account Card - Updated confirmation */}
            <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
                <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <FiTrash2 className="w-5 h-5 text-red-600" /> Delete Account
                </h2>
                <p className="text-sm text-red-700 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                {!showDeleteConfirm ? (
                    <button 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center justify-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md shadow-sm text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Delete My Account
                    </button>
                ) : (
                    <div className="bg-white p-4 rounded border border-red-300">
                        <p className="text-sm font-medium text-red-800 mb-3 flex items-center gap-2">
                            <FiAlertTriangle className="w-5 h-5 text-red-600"/> Are you absolutely sure?
                        </p>
                        <p className="text-xs text-gray-600 mb-4">This will permanently delete everything. Please type your current email (<span className="font-mono text-red-700">{storeUserEmail}</span>) to confirm.</p>
                         <input 
                            type="email" 
                            placeholder="Type your email to confirm" 
                            value={deleteConfirmEmail}
                            onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm mb-3" 
                         />
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDeleteAccount} 
                                disabled={deleteLoading || deleteConfirmEmail !== storeUserEmail} // Check confirmation email
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:bg-red-300"
                            >
                                 {deleteLoading ? <Spinner size="sm" color="white" className="mr-2"/> : null}
                                {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                            <button 
                                onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmEmail(''); }} // Reset confirm email on cancel
                                disabled={deleteLoading}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Setting;
