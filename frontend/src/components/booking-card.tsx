'use client';

import { useState } from 'react';
import { Booking, bookingAPI } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  onDelete: (bookingId: string) => void;
}

export default function BookingCard({ booking, onDelete }: BookingCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowConfirm(false);
    
    try {
      await bookingAPI.delete(booking.id);
      onDelete(booking.id);
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isPastBooking = new Date(booking.end) < new Date();

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${
      isPastBooking ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${
            isPastBooking ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {booking.title}
          </h3>
          <p className={`text-sm ${
            isPastBooking ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatDate(booking.start)}
          </p>
          <p className={`text-sm ${
            isPastBooking ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatTime(booking.start)} - {formatTime(booking.end)}
          </p>
          {isPastBooking && (
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
              Past Event
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {!isPastBooking && (
            <>
              {showConfirm ? (
                <div className="flex space-x-1">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? '...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={isDeleting}
                  className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-400">
        Created: {new Date(booking.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
} 