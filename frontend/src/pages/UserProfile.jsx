import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function UserProfile() {
    const { user, login } = useContext(AuthContext); // Re-login strictly to refresh context if needed, better to have a reloadUser
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        profile_picture: '',
        password: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/me');
            setFormData({
                full_name: res.data.full_name || '',
                phone: res.data.phone || '',
                profile_picture: res.data.profile_picture || '',
                password: ''
            });
        } catch (error) {
            toast.error('Failed to load profile');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updateData = {};
            if (formData.full_name) updateData.full_name = formData.full_name;
            if (formData.phone) updateData.phone = formData.phone;
            if (formData.profile_picture) updateData.profile_picture = formData.profile_picture;
            if (formData.password) updateData.password = formData.password;

            const res = await api.put('/users/me', updateData);
            toast.success('Profile updated successfully');

            // Quick hack: update local storage to reflect name change immediately if we rely on it
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.full_name = res.data.full_name;
            localStorage.setItem('user', JSON.stringify(storedUser));
            window.location.reload(); // Reload to refresh Navbar context 

        } catch (error) {
            toast.error('Update failed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto py-10 px-4"
        >
            <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-500">
                        {formData.profile_picture ? (
                            <img src={formData.profile_picture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-3xl text-gray-400">{formData.full_name?.[0]}</span>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                        <input
                            value={formData.profile_picture}
                            onChange={e => setFormData({ ...formData, profile_picture: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/me.jpg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                        Save Changes
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}
