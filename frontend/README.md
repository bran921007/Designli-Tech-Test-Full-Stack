# Booking System Frontend

A modern booking system frontend built with Next.js, React, and TypeScript that allows users to book time slots with Google Calendar integration.

## 🚀 Features

- **Google OAuth Authentication**: Secure login using Google accounts
- **Booking Management**: Create, view, and cancel time slot bookings
- **Google Calendar Integration**: Prevents conflicts with existing Google Calendar events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic booking list updates
- **Modern UI**: Clean and intuitive interface built with Tailwind CSS

## 📋 Prerequisites

Run `nvm use` from the repository root before installing dependencies.

- Node.js 24.22.1 or a later patched 24.x release installed
- Backend API running on `http://localhost:3000` (see backend documentation)
- Google OAuth credentials configured in the backend

## 🛠 Installation & Setup


1. **Install dependencies**
   ```bash
   cd frontend
   npm ci
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   Open [http://localhost:3001](http://localhost:3001) in your browser

## 🏗 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── auth/
│   │   │   └── callback/       # OAuth callback handler
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── booking-card.tsx    # Individual booking display
│   │   ├── booking-form.tsx    # Booking creation form
│   │   ├── dashboard.tsx       # Main dashboard
│   │   └── login-page.tsx      # Login interface
│   └── lib/                    # Utilities and services
│       ├── api.ts              # API service functions
│       ├── auth-context.tsx    # Authentication context
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── package.json
└── README.md
```

## 🔧 Key Components

### Authentication Flow

1. **Login Page**: Google OAuth sign-in button
2. **Auth Callback**: Handles OAuth redirect and token extraction
3. **Auth Context**: Manages authentication state globally
4. **Protected Routes**: Automatically redirects unauthenticated users

### Booking Management

1. **Dashboard**: Main interface showing all bookings
2. **Booking Form**: Modal for creating new bookings
3. **Booking Card**: Individual booking display with cancel functionality
4. **Time Validation**: Prevents past bookings and invalid time ranges

## 🔌 API Integration

The frontend integrates with the backend API running on `http://localhost:3000`:

### Authentication Endpoints
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout user

### Booking Endpoints
- `POST /bookings` - Create new booking
- `GET /bookings` - Get all user bookings
- `GET /bookings/:id` - Get specific booking
- `DELETE /bookings/:id` - Delete booking

## 🎨 UI/UX Features

- **Responsive Design**: Adapts to different screen sizes
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Confirmation Dialogs**: Prevent accidental deletions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Dark/Light Mode**: Supports system preference

## 🧪 Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
No environment variables required for the frontend. The API base URL is configured in `src/lib/api.ts`.

## 🔄 Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, redirected to `/auth/callback?token=...`
4. Frontend extracts token and stores in localStorage
5. User profile fetched and stored in React context
6. Dashboard displayed with user's bookings

## 📱 Features Overview

### User Authentication
- Secure Google OAuth 2.0 integration
- Automatic token management
- Persistent login sessions
- Secure logout functionality

### Booking Management
- Create bookings with title, start time, and end time
- View all bookings in chronological order
- Separate upcoming and past bookings
- Cancel future bookings with confirmation
- Real-time booking updates

### UI/UX
- Clean, modern interface
- Intuitive navigation
- Responsive design for all devices
- Loading states and error handling
- Confirmation dialogs for destructive actions

## 🚨 Error Handling

The application handles various error scenarios:
- Network connectivity issues
- Invalid authentication tokens
- Booking conflicts
- Server errors
- Form validation errors

## 📸 Screenshots

The application includes:
- Login page with Google sign-in
- Dashboard showing upcoming and past bookings
- Booking form modal
- Responsive booking cards
- User profile display

## 🔐 Security

- JWT token-based authentication
- Secure token storage in localStorage
- Automatic token validation
- Protected API routes
- CSRF protection through SameSite cookies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of a technical assessment for Designli and is for evaluation purposes only.

---

Built with ❤️ using Next.js, React, TypeScript, and Tailwind CSS.
