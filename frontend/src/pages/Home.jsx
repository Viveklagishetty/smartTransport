import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const LandingHome = () => (
    <div className="relative min-h-screen">
        <div className="absolute inset-0 z-0">
            <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Logistics Background"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>

        <div className="relative z-10 pt-32 px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 text-white tracking-tight leading-tight drop-shadow-lg">
                Logistics <span className="text-blue-500">Reimagined.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto font-light drop-shadow-md">
                Connect empty trucks with waiting cargo. The smartest way to move freight.
            </p>

            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-24">
                <Link to="/signup" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition transform duration-300">Get Started</Link>
                <Link to="/login" className="px-10 py-5 bg-white bg-opacity-10 backdrop-blur-md border border-white/30 text-white rounded-full text-lg font-bold shadow-xl hover:bg-opacity-20 hover:scale-105 transition transform duration-300">Login</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto text-left">
                <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl hover:bg-black/50 transition duration-300 group">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 text-white text-2xl group-hover:scale-110 transition duration-300">🚛</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Vehicle Owners</h3>
                    <p className="text-gray-300 leading-relaxed">Stop driving empty. Publish your return routes and get matched with high-value cargo instantly.</p>
                </div>
                <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl hover:bg-black/50 transition duration-300 group">
                    <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 text-white text-2xl group-hover:scale-110 transition duration-300">📦</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Customers</h3>
                    <p className="text-gray-300 leading-relaxed">Ship smarter. Find verified trucks already going your way and save up to 40% on shipping costs.</p>
                </div>
                <div className="p-8 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl hover:bg-black/50 transition duration-300 group">
                    <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 text-white text-2xl group-hover:scale-110 transition duration-300">🔒</div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Secure & Trusted</h3>
                    <p className="text-gray-300 leading-relaxed">Real-time tracking, verified profiles, and secure payments. Your cargo is in safe hands.</p>
                </div>
            </div>
        </div>
    </div>
);

export const OwnerHome = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gray-900 pb-32 overflow-hidden">
            <div className="absolute inset-0">
                <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Truck Fleet" />
                <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">Owner Dashboard</h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">Manage your fleet, post trips, and maximize your efficiency.</p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300">
                    <div className="h-48 bg-gray-200 relative">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Empty Truck Fleet" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4 text-white font-bold text-2xl">My Fleet</div>
                    </div>
                    <div className="p-8">
                        <p className="text-gray-600 mb-6 text-lg">Add new vehicles, update truck details, and manage capacities.</p>
                        <Link to="/owner" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full transition duration-300 shadow-md">Manage Vehicles</Link>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300">
                    <div className="h-48 bg-gray-200 relative">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" alt="Route" />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4 text-white font-bold text-2xl">Trip Management</div>
                    </div>
                    <div className="p-8">
                        <p className="text-gray-600 mb-6 text-lg">Post new return routes, check booking requests, and fill empty legs.</p>
                        <Link to="/owner" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 w-full transition duration-300 shadow-md">Manage Trips</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const CustomerHome = () => (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                        <div className="sm:text-center lg:text-left">
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block xl:inline">Ready to ship?</span>{' '}
                                <span className="block text-blue-600 xl:inline mt-2">Find a truck now.</span>
                            </h1>
                            <p className="mt-6 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-relaxed">
                                Enter your route details and instantly match with available trucks heading your way. Save money and time with our smart matching engine.
                            </p>
                            <div className="mt-8 sm:mt-10 sm:flex sm:justify-center lg:justify-start">
                                <div className="rounded-md shadow">
                                    <Link to="/customer" className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-xl md:px-10 shadow-lg hover:shadow-xl transition transform hover:scale-105 duration-300">
                                        Find Transport
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80" alt="Shipping" />
            </div>
        </div>

        {/* Features Section */}
        <div className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Why Choose Us</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        A better way to send freight
                    </p>
                </div>
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">⏱️</div>
                        <h3 className="text-xl font-bold mb-2">Instant Matches</h3>
                        <p className="text-gray-600">No more phone calls. Get matched instantly.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">💰</div>
                        <h3 className="text-xl font-bold mb-2">Best Prices</h3>
                        <p className="text-gray-600">Save up to 40% using return trip capacity.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <div className="text-4xl mb-4">🛡️</div>
                        <h3 className="text-xl font-bold mb-2">Secure</h3>
                        <p className="text-gray-600">Verified carriers and secure payments.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const Home = () => {
    const { user } = useContext(AuthContext);
    if (!user) return <LandingHome />;
    if (user.role === 'owner') return <OwnerHome />;
    if (user.role === 'customer') return <CustomerHome />;
    return <LandingHome />;
};
