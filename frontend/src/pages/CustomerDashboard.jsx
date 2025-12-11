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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setMyBookings(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { start_location, end_location } = searchParams;
            const res = await api.get('/trips', { params: { start_location, end_location } });
            setSearchResults(res.data);
            if (res.data.length === 0) toast.error('No trips found');
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
            setActiveTab('bookings');
            fetchBookings();
        } catch (error) {
            toast.error('Booking failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Customer Dashboard</h1>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button onClick={() => setActiveTab('search')} className={`${activeTab === 'search' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Find Transport</button>
                        <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>My Bookings</button>
                    </nav>
                </div>

                {activeTab === 'search' && (
                    <div>
                        {/* Search Form */}
                        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <input placeholder="From Location" value={searchParams.start_location} onChange={e => setSearchParams({ ...searchParams, start_location: e.target.value })} className="border p-2 rounded" />
                                <input placeholder="To Location" value={searchParams.end_location} onChange={e => setSearchParams({ ...searchParams, end_location: e.target.value })} className="border p-2 rounded" />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
                            </form>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {searchResults.map(trip => (
                                <div key={trip.id} className="bg-white overflow-hidden shadow rounded-lg px-4 py-5 sm:p-6 border border-gray-100">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-medium text-gray-900">{trip.start_location} ➝ {trip.end_location}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 rounded-full">{trip.status}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Date: {new Date(trip.start_datetime).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">Capacity: {trip.available_capacity}</p>
                                    <p className="text-sm text-gray-500">Price est: {trip.price_per_unit}/unit</p>
                                    <button onClick={() => initBooking(trip)} className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Now</button>
                                </div>
                            ))}
                        </div>

                        {/* Booking Modal */}
                        {selectedTrip && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                                    <h2 className="text-xl font-bold mb-4">Book Trip</h2>
                                    <p className="text-sm text-gray-500 mb-4">{selectedTrip.start_location} to {selectedTrip.end_location}</p>
                                    <form onSubmit={handleBookTrip} className="space-y-4">
                                        <input placeholder="Cargo Size (e.g. 5 tons)" value={bookingFormData.cargo_size} onChange={e => setBookingFormData({ ...bookingFormData, cargo_size: e.target.value })} className="border p-2 w-full rounded" required />
                                        <input placeholder="Offer Price ($)" value={bookingFormData.total_price} onChange={e => setBookingFormData({ ...bookingFormData, total_price: e.target.value })} className="border p-2 w-full rounded" required />
                                        <div className="flex justify-end space-x-2">
                                            <button type="button" onClick={() => setSelectedTrip(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Booking</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {myBookings.map(booking => (
                                <li key={booking.id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">Trip #{booking.trip_id}</p>
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'accepted' ? 'bg-green-100 text-green-800' : booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">Cargo: {booking.cargo_size} | Price: ${booking.total_price}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
