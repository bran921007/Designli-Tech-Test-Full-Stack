const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleCalendarConnected?: boolean;
}

export interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  title: string;
  start: string;
  end: string;
}

export interface GoogleCalendarStatus {
  connected: boolean;
  connectedAt: string | null;
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const authAPI = {

  loginWithAuth0: () => {
    window.location.href = `${API_BASE_URL}/auth/auth0`;
  },

  connectGoogleCalendar: () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token found');
      window.location.href = '/';
      return;
    }
    
    window.location.href = `${API_BASE_URL}/auth/google?token=${encodeURIComponent(token)}`;
  },

  getGoogleCalendarStatus: async (): Promise<GoogleCalendarStatus> => {
    const response = await fetch(`${API_BASE_URL}/auth/google/status`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get Google Calendar status');
    }
    
    return response.json();
  },

  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile API error response:', errorText);
      throw new Error(`Failed to get user profile: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const profileData = await response.json();
    return profileData;
  },

  logout: async (): Promise<void> => {
    try {

      removeAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isAuth0Logout: true
        }),
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else if (!response.ok) {
        console.error('Logout failed:', response.statusText);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  },
};

export const bookingAPI = {

  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }
    
    return response.json();
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get bookings');
    }
    
    return response.json();
  },

  delete: async (id: string): Promise<Booking> => {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    
    return response.json();
  },
}; 