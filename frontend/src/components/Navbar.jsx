import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-blue-600">SmartTrans</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700 font-medium">Hello, {user.full_name || user.email}</span>
                                {user.role === 'owner' && <Link to="/owner" className="text-gray-600 hover:text-blue-600">Dashboard</Link>}
                                {user.role === 'customer' && <Link to="/customer" className="text-gray-600 hover:text-blue-600">Search</Link>}
                                {user.role === 'admin' && <Link to="/admin" className="text-gray-600 hover:text-blue-600">Admin</Link>}
                                <Link to="/profile" className="text-gray-600 hover:text-blue-600">Profile</Link>
                                <NotificationBell />
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-800">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
