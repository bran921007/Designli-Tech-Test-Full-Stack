'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState('');

  useEffect(() => {
    const message = searchParams.get('message');
    
    if (message === 'InvalidCalendarConnection') {
      setErrorType('calendar');
      setErrorMessage('Unable to connect to Google Calendar. Please try again.');
    } else if (message === 'CalendarPermissionDenied') {
      setErrorType('calendar');
      setErrorMessage('Google Calendar permission was denied. You can try connecting again later.');
    } else if (message === 'AuthenticationFailed') {
      setErrorType('auth');
      setErrorMessage('Authentication failed. Please try logging in again.');
    } else {
      setErrorType('general');
      setErrorMessage(message || 'An error occurred during the authentication process.');
    }
  }, [searchParams]);

  const handleRetryCalendar = () => {
    router.push('/');
  };

  const handleBackToDashboard = () => {
    router.push('/');
  };

  const isCalendarError = errorType === 'calendar';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className={`rounded-full h-20 w-20 mx-auto flex items-center justify-center mb-6 ${
          isCalendarError ? 'bg-orange-100' : 'bg-red-100'
        }`}>
          {isCalendarError ? (
            <svg className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ) : (
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {isCalendarError ? '📅 Calendar Connection Issue' : '🚫 Authentication Error'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {errorMessage}
        </p>

        {isCalendarError ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">
              Don&apos;t worry, you&apos;re still logged in. You can try connecting your calendar again or continue using the app without calendar integration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetryCalendar}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleBackToDashboard}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Continue Without Calendar
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
} 