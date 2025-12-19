import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function OwnerDashboard() {
    const [activeTab, setActiveTab] = useState('vehicles');
    const [vehicles, setVehicles] = useState([]);
    const [trips, setTrips] = useState([]);
    const [bookings, setBookings] = useState([]); // Bookings on MY trips
    const [loading, setLoading] = useState(true);

    // Forms state
    const [newVehicle, setNewVehicle] = useState({ type: '', capacity: '', registration_number: '' });
    const [newTrip, setNewTrip] = useState({ vehicle_id: '', start_location: '', end_location: '', start_datetime: '', price_per_unit: '', available_capacity: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const vRes = await api.get('/vehicles');
            setVehicles(vRes.data);
            const tRes = await api.get('/trips/my-trips');
            setTrips(tRes.data);
            const bRes = await api.get('/bookings'); // As owner, returns bookings for my trips
            setBookings(bRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load dashboard data');
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await api.post('/vehicles', newVehicle);
            toast.success('Vehicle added');
            fetchData();
            setNewVehicle({ type: '', capacity: '', registration_number: '' });
        } catch (error) {
            toast.error('Failed to add vehicle');
        }
    };

    const handleAddTrip = async (e) => {
        e.preventDefault();
        try {
            await api.post('/trips', newTrip);
            toast.success('Trip posted successfully');
            fetchData();
        } catch (error) {
            // console.error(error);
            toast.error('Failed to post trip');
        }
    };

    const handleBookingAction = async (bookingId, action) => {
        try {
            await api.put(`/bookings/${bookingId}/status?status_update=${action}`);
            toast.success(`Booking ${action}`);
            fetchData();
        } catch (error) {
            toast.error('Action failed');
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-blue-900 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Owner Dashboard</h1>
                    <p className="mt-2 text-blue-200">Manage your fleet and bookings with ease.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
                    {/* Tabs */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <nav className="flex -mb-px px-6" aria-label="Tabs">
                            {['vehicles', 'trips', 'bookings'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${activeTab === tab
                                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-5 px-8 border-b-2 font-bold text-sm uppercase tracking-wide transition-colors duration-200`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-8">
                        {/* Content */}
                        {activeTab === 'vehicles' && (
                            <div className="space-y-8">
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl leading-6 font-bold text-gray-900">Add New Vehicle</h3>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                        <form onSubmit={handleAddVehicle} className="grid grid-cols-1 gap-y-6 sm:grid-cols-4 sm:gap-x-4">
                                            <input placeholder="Type (e.g. Truck)" value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input placeholder="Capacity (e.g. 10 tons)" value={newVehicle.capacity} onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input placeholder="Registration No." value={newVehicle.registration_number} onChange={e => setNewVehicle({ ...newVehicle, registration_number: e.target.value })} className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <button type="submit" className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent shadow-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                                Add Vehicle
                                            </button>
                                        </form>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-6">Your Fleet</h3>
                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        {vehicles.map(v => (
                                            <div key={v.id} className="relative group bg-white border border-gray-200 rounded-xl px-6 py-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">🚛</div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{v.type}</h3>
                                                        <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded inline-block mt-1">{v.registration_number}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                                    <span className="text-sm text-gray-500">Capacity</span>
                                                    <span className="text-sm font-semibold text-gray-900">{v.capacity}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {activeTab === 'trips' && (
                            <div className="space-y-8">
                                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                                    <h3 className="text-xl leading-6 font-bold text-blue-900 mb-6">Post New Trip</h3>
                                    <form onSubmit={handleAddTrip} className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <select value={newTrip.vehicle_id} onChange={e => setNewTrip({ ...newTrip, vehicle_id: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
                                                <option value="">Select Vehicle</option>
                                                {vehicles.map(v => <option key={v.id} value={v.id}>{v.type} ({v.registration_number})</option>)}
                                            </select>
                                            <input type="datetime-local" value={newTrip.start_datetime} onChange={e => setNewTrip({ ...newTrip, start_datetime: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input placeholder="From Location" value={newTrip.start_location} onChange={e => setNewTrip({ ...newTrip, start_location: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input placeholder="To Location" value={newTrip.end_location} onChange={e => setNewTrip({ ...newTrip, end_location: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input placeholder="Available Space (e.g. 5 tons)" value={newTrip.available_capacity} onChange={e => setNewTrip({ ...newTrip, available_capacity: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                            <input type="number" placeholder="Price per unit ($)" value={newTrip.price_per_unit} onChange={e => setNewTrip({ ...newTrip, price_per_unit: e.target.value })} className="block w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="inline-flex justify-center items-center px-8 py-3 border border-transparent shadow-md font-bold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform active:scale-95">
                                                Post Trip
                                            </button>
                                        </div>
                                    </form>
                                </section>

                                <section>
                                    <h3 className="text-xl leading-6 font-bold text-gray-900 mb-6">Active Trips</h3>
                                    <ul className="grid grid-cols-1 gap-4">
                                        {trips.map(trip => (
                                            <li key={trip.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="px-6 py-5">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">📍</div>
                                                            <div>
                                                                <p className="text-lg font-bold text-gray-900">{trip.start_location} <span className="text-gray-400 mx-2">→</span> {trip.end_location}</p>
                                                                <p className="text-sm text-gray-500">{new Date(trip.start_datetime).toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800 uppercase tracking-wide">{trip.status}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div>
                                <h3 className="text-xl leading-6 font-bold text-gray-900 mb-6">Incoming Requests</h3>
                                <ul className="space-y-4">
                                    {bookings.length === 0 && (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <p className="text-gray-500 text-lg">No booking requests received yet.</p>
                                        </div>
                                    )}
                                    {bookings.map(booking => (
                                        <li key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg font-bold text-gray-900">Trip #{booking.trip_id} Request</span>
                                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${booking.status === 'accepted' ? 'bg-green-100 text-green-800' : booking.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-gray-600 space-y-1">
                                                        <p><span className="font-semibold">Cargo:</span> {booking.cargo_size}</p>
                                                        <p><span className="font-semibold">Total Price:</span> ${booking.total_price}</p>
                                                    </div>
                                                </div>
                                                {booking.status === 'pending' && (
                                                    <div className="mt-4 sm:mt-0 flex space-x-3">
                                                        <button onClick={() => handleBookingAction(booking.id, 'accepted')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-colors">
                                                            Accept
                                                        </button>
                                                        <button onClick={() => handleBookingAction(booking.id, 'rejected')} className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
