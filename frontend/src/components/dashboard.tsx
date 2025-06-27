'use client';

import { useState, useEffect } from 'react';
import { Booking, bookingAPI, authAPI, GoogleCalendarStatus } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import BookingCard from './booking-card';
import BookingForm from './booking-form';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [error, setError] = useState('');
  
  const [calendarStatus, setCalendarStatus] = useState<GoogleCalendarStatus>({
    connected: false,
    connectedAt: null
  });
  const [isLoadingCalendarStatus, setIsLoadingCalendarStatus] = useState(false);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const userBookings = await bookingAPI.getAll();
      userBookings.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

      setBookings(userBookings);
      setError('');

    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkGoogleCalendarStatus = async () => {
    try {
      setIsLoadingCalendarStatus(true);
      const status = await authAPI.getGoogleCalendarStatus();
      setCalendarStatus(status);
    } catch (error) {
      console.error('Failed to check Google Calendar status:', error);
    } finally {
      setIsLoadingCalendarStatus(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    checkGoogleCalendarStatus();
  }, []);

  const handleBookingCreated = () => {
    setShowBookingForm(false);
    fetchBookings();
  };

  const handleBookingDeleted = (bookingId: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== bookingId));
  };

  const handleConnectGoogleCalendar = () => {
    authAPI.connectGoogleCalendar();
  };

  const handleReconnectCalendar = () => {
    authAPI.connectGoogleCalendar();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatConnectionDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(booking => new Date(booking.start) > now);
  const pastBookings = bookings.filter(booking => new Date(booking.start) <= now);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Booking System</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          {isLoadingCalendarStatus ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Checking calendar status...</span>
            </div>
          ) : calendarStatus.connected ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    ✅ Google Calendar Connected
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connected on {formatConnectionDate(calendarStatus.connectedAt)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Your bookings will sync automatically and check for conflicts.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <button
                  onClick={handleReconnectCalendar}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                >
                  🔄 Reconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    📅 Connect Google Calendar
                  </h3>
                  <p className="text-sm text-gray-600">
                    Connect your Google Calendar to automatically check for conflicts and sync your bookings.
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-sm text-gray-600">Not connected</span>
                </div>
                <button
                  onClick={handleConnectGoogleCalendar}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                >
                  🔗 Connect Calendar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Your Bookings</h2>
            <p className="text-sm text-gray-600">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setShowBookingForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            New Booking
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            <button
              onClick={fetchBookings}
              className="ml-2 text-red-800 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading bookings...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            {upcomingBookings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Upcoming Bookings ({upcomingBookings.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onDelete={handleBookingDeleted}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Past Bookings ({pastBookings.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pastBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onDelete={handleBookingDeleted}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {bookings.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a4 4 0 118 0v4m-4 8a4 4 0 118 0v-4a4 4 0 11-8 0V7"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new booking.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Create your first booking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          onSuccess={handleBookingCreated}
          onCancel={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
} 