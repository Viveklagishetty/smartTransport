import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function CustomerDashboard() {
    const [activeTab, setActiveTab] = useState('search');
    const [searchParams, setSearchParams] = useState({ start_location: '', end_location: '' });
    const [searchResults, setSearchResults] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [bookingFormData, setBookingFormData] = useState({ cargo_size: '', total_price: '' });
    const [selectedTrip, setSelectedTrip] = useState(null); // For booking modal
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setMyBookings(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load bookings');
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { start_location, end_location } = searchParams;
            const res = await api.get('/trips', { params: { start_location, end_location } });
            setSearchResults(res.data);
            if (res.data.length === 0) toast.error('No trips found');
            else toast.success(`Found ${res.data.length} trips`);
        } catch (error) {
            toast.error('Search failed');
        }
    };

    const initBooking = (trip) => {
        setSelectedTrip(trip);
        // Auto-calculate suggested price? For now manual.
    };

    const handleBookTrip = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings', { ...bookingFormData, trip_id: selectedTrip.id });
            toast.success('Booking request sent!');
            setSelectedTrip(null);
            setBookingFormData({ cargo_size: '', total_price: '' });
            setActiveTab('bookings');
            fetchBookings();
        } catch (error) {
            toast.error('Booking failed');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Section */}
            <div className="bg-blue-900 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Customer Dashboard</h1>
                    <p className="mt-2 text-blue-200">Find transport and manage your shipments.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <nav className="flex -mb-px px-6" aria-label="Tabs">
                            {['search', 'bookings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${activeTab === tab
                                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-5 px-8 border-b-2 font-bold text-sm uppercase tracking-wide transition-colors duration-200`}
                                >
                                    {tab === 'search' ? 'Find Transport' : 'My Bookings'}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* Search Tab */}
                        {activeTab === 'search' && (
                            <div className="space-y-8">
                                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                                    <h3 className="text-xl leading-6 font-bold text-blue-900 mb-6">Search for Trips</h3>
                                    <form onSubmit={handleSearch} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="relative">
                                                <input
                                                    placeholder="From Location"
                                                    value={searchParams.start_location}
                                                    onChange={e => setSearchParams({ ...searchParams, start_location: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10"
                                                />
                                                <span className="absolute left-3 top-3.5 text-gray-400">📍</span>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    placeholder="To Location"
                                                    value={searchParams.end_location}
                                                    onChange={e => setSearchParams({ ...searchParams, end_location: e.target.value })}
                                                    className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pl-10"
                                                />
                                                <span className="absolute left-3 top-3.5 text-gray-400">🏁</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="inline-flex justify-center items-center px-8 py-3 border border-transparent shadow-md font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform active:scale-95">
                                                Find Trips
                                            </button>
                                        </div>
                                    </form>
                                </section>

                                <section>
                                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-6">Available Trips</h3>
                                    {searchResults.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 text-lg">No trips found. Try a different search.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                            {searchResults.map(trip => (
                                                <div key={trip.id} className="relative group bg-white border border-gray-200 rounded-xl px-6 py-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">🚚</div>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase rounded-full">{trip.status}</span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{trip.start_location} <span className="text-gray-400">→</span> {trip.end_location}</h3>
                                                        <p className="text-sm text-gray-500 mb-4">{new Date(trip.start_datetime).toLocaleString()}</p>

                                                        <div className="space-y-2 text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Capacity:</span>
                                                                <span className="font-semibold">{trip.available_capacity}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-gray-500">Price/Unit:</span>
                                                                <span className="font-semibold text-green-600">${trip.price_per_unit}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => initBooking(trip)}
                                                        className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                                                    >
                                                        Book Now
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </div>
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <div>
                                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-6">My Bookings</h3>
                                <ul className="space-y-4">
                                    {myBookings.length === 0 && (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 text-lg">You haven't made any bookings yet.</p>
                                        </div>
                                    )}
                                    {myBookings.map(booking => (
                                        <li key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg font-bold text-gray-900">Trip #{booking.trip_id}</span>
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${booking.status === 'accepted' ? 'bg-green-100 text-green-800' : booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <p><span className="font-semibold">Cargo:</span> {booking.cargo_size}</p>
                                                        <p><span className="font-semibold">Total Price:</span> ${booking.total_price}</p>
                                                    </div>
                                                </div>
                                                {/* Actions or Status Icon */}
                                                <div className="text-2xl">
                                                    {booking.status === 'accepted' ? '✅' : booking.status === 'rejected' ? '❌' : '⏳'}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Booking Modal */}
            {selectedTrip && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedTrip(null)}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <span className="text-blue-600 text-xl">📝</span>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Book Trip: {selectedTrip.start_location} to {selectedTrip.end_location}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">
                                                Please specify your cargo details and offer price.
                                            </p>
                                            <form onSubmit={handleBookTrip} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Cargo Size</label>
                                                    <input
                                                        placeholder="e.g. 5 tons"
                                                        value={bookingFormData.cargo_size}
                                                        onChange={e => setBookingFormData({ ...bookingFormData, cargo_size: e.target.value })}
                                                        className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Offer Price ($)</label>
                                                    <input
                                                        placeholder="e.g. 500"
                                                        value={bookingFormData.total_price}
                                                        onChange={e => setBookingFormData({ ...bookingFormData, total_price: e.target.value })}
                                                        className="mt-1 block w-full px-3 py-2 border border-blue-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">Suggested base price: ${selectedTrip.price_per_unit} per unit</p>
                                                </div>
                                                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setSelectedTrip(null)}
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
