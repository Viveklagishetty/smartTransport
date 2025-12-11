import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { BellIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function NotificationBell() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications/');
                const unread = res.data.filter(n => !n.is_read);
                setNotifications(res.data);
                setHasNew(unread.length > 0);

                // Show toast for new unread messages if just loaded
                if (unread.length > 0) {
                    // In a real polling, we'd track 'last processed' to avoid repetitive toasts, 
                    // but for this demo instant toast is fine
                }
            } catch (error) {
                console.error("Poll failed", error);
            }
        };

        fetchNotifications();
        // Poll every 5 seconds
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            setHasNew(notifications.some(n => !n.is_read && n.id !== id));
        } catch (error) {
            console.error("Mark read failed", error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 rounded-full text-gray-600 hover:text-blue-600 focus:outline-none relative"
            >
                <BellIcon className="h-6 w-6" />
                {hasNew && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-600 animate-pulse"></span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100 font-semibold text-gray-700">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                className={`px-4 py-3 text-sm border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.is_read ? 'bg-blue-50' : ''}`}
                                onClick={() => markAsRead(n.id)}
                            >
                                <p className="text-gray-900">{n.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
