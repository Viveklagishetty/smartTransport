import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TruckAvatar } from '../../components/Avatars';

export default function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'customer' // default role
    });

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const getPasswordStrength = (pass) => {
        let strength = 0;
        if (pass.length > 6) strength++;
        if (pass.length > 10) strength++;
        if (/[A-Z]/.test(pass)) strength++;
        if (/[0-9]/.test(pass)) strength++;
        if (/[^A-Za-z0-9]/.test(pass)) strength++;
        return strength;
    };

    const strength = getPasswordStrength(formData.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            toast.error('You must agree to the Terms of Service');
            return;
        }
        try {
            await signup(formData);
            toast.success('Account created! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.detail || 'Signup failed. Email may be taken.';
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute -bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 relative z-10"
            >
                <div className="flex justify-center">
                    <TruckAvatar className="h-16 w-16 bg-gradient-to-tr from-green-500 to-emerald-600 text-white shadow-lg" />
                </div>
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                        Create Account
                    </h2>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <p className="text-sm font-medium text-green-600">Secure Registration</p>
                    </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <input name="full_name" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white pl-10" placeholder="Full Name" onChange={handleChange} />
                            <span className="absolute left-3 top-3.5 text-gray-400">👤</span>
                        </div>
                        <div className="relative">
                            <input type="email" name="email" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white pl-10" placeholder="Email address" onChange={handleChange} />
                            <span className="absolute left-3 top-3.5 text-gray-400">📧</span>
                        </div>
                        <div className="relative">
                            <input name="phone" required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white pl-10" placeholder="Phone Number" onChange={handleChange} />
                            <span className="absolute left-3 top-3.5 text-gray-400">📱</span>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 focus:bg-white pl-10"
                                    placeholder="Password"
                                    onChange={handleChange}
                                />
                                <span className="absolute left-3 top-3.5 text-gray-400">🔒</span>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            {/* Password Strength Meter */}
                            {formData.password && (
                                <div className="flex space-x-1 h-1.5 mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-full flex-1 rounded-full transition-colors duration-300 ${i < strength
                                                    ? strength < 3 ? 'bg-red-400' : strength < 5 ? 'bg-yellow-400' : 'bg-green-500'
                                                    : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                            {formData.password && (
                                <p className="text-xs text-right text-gray-500">
                                    {strength < 3 ? 'Weak' : strength < 5 ? 'Medium' : 'Strong'}
                                </p>
                            )}
                        </div>

                        <div className="px-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">I am a:</label>
                            <select name="role" onChange={handleChange} className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white">
                                <option value="customer">Customer (I want to ship goods)</option>
                                <option value="owner">Vehicle Owner (I have a truck/van)</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                            </label>
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button type="submit" className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white shadow-md transition duration-150 ${agreedToTerms ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`} disabled={!agreedToTerms}>
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                {/* Lock Icon */}
                                <svg className={`h-5 w-5 ${agreedToTerms ? 'text-blue-500 group-hover:text-blue-400' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </span>
                            Create Secure Account
                        </button>
                    </motion.div>
                </form>
                <div className="text-center">
                    <p className="mt-2 text-xs text-gray-500">
                        <span role="img" aria-label="shield">🛡️</span> Bank-level 256-bit encryption
                    </p>
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition block mt-4">
                        Already have an account? Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
