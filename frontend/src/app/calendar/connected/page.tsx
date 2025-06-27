'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function CalendarConnected() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const handleCalendarConnection = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        await refreshProfile();
        
        setStatus('success');
    
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } catch (error) {
        console.error('Calendar connection error:', error);
        setStatus('error');
      }
    };

    handleCalendarConnection();
  }, [router, refreshProfile]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Google Calendar</h2>
          <p className="text-gray-600">
            Please wait while we set up your calendar integration...
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="rounded-full h-20 w-20 bg-green-100 mx-auto flex items-center justify-center mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">🎉 Calendar Connected!</h2>
          <p className="text-gray-600 mb-2">
            Your Google Calendar has been successfully connected.
          </p>
          <p className="text-sm text-green-600 mb-6">
            ✅ Bookings will now sync automatically<br/>
            ✅ Conflict detection is now active
          </p>
          <div className="flex items-center justify-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Redirecting you back to the dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="rounded-full h-16 w-16 bg-red-100 mx-auto flex items-center justify-center mb-4">
          <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Failed</h2>
        <p className="text-gray-600 mb-4">
          There was an issue connecting your Google Calendar. Please try again.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Go back to Dashboard
        </button>
      </div>
    </div>
  );
} 