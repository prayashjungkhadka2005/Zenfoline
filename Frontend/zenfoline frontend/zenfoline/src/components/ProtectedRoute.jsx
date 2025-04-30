import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const location = useLocation();

    if (!isAuthenticated || !token) {
        // If the route is an admin route, redirect to "/"
        if (location.pathname.startsWith('/admindashboard')) {
            return <Navigate to="/" replace state={{ message: "You must be logged in to access this page." }} />;
        }
        // Otherwise, redirect to user login
        return <Navigate to="/login" replace state={{ message: "You must be logged in to access this page." }} />;
    }

    return children;
};

export default ProtectedRoute; 