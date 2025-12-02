import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import Confirm from '../pages/Auth/Confirm';
import ResetPassword from '../pages/Auth/ResetPassword';

import Welcome from '../pages/Welcome'; // Dashboard sifatida ishlaydi
import Habits from '../pages/Habits/Habits';
import Analytics from '../pages/Analytics/Analytics';
import Goals from '../pages/Goals/Goals';
import Community from '../pages/Community/Community';
import Notifications from '../pages/Notifications/Notifications';
import Profile from '../pages/Profile/Profile';

export const routes = [
  { path: '/auth/signin', element: <SignIn /> },
  { path: '/auth/signup', element: <SignUp /> },
  { path: '/auth/confirm', element: <Confirm /> },
  { path: '/auth/reset-password', element: <ResetPassword /> },

  // ASOSIY DASHBOARD — Welcome.jsx
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Welcome username="Murod" />
      </ProtectedRoute>
    ),
  },

  { path: '/habits', element: <ProtectedRoute><Habits /></ProtectedRoute> },
  { path: '/analytics', element: <ProtectedRoute><Analytics /></ProtectedRoute> },
  { path: '/goals', element: <ProtectedRoute><Goals /></ProtectedRoute> },
  { path: '/community', element: <ProtectedRoute><Community /></ProtectedRoute> },
  { path: '/notifications', element: <ProtectedRoute><Notifications /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },

  // 404 -> dashboard
  { path: '*', element: <Navigate to="/" replace /> },
];
