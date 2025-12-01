import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import Confirm from '../pages/Auth/Confirm';
import ResetPassword from '../pages/Auth/ResetPassword';
import Welcome from '../pages/Welcome';
import Habits from '../pages/Habits/Habits';
import Analytics from '../pages/Analytics/Analytics';
import Goals from '../pages/Goals/Goals';
import Community from '../pages/Community/Community';
import Notifications from '../pages/Notifications/Notifications';
import Profile from '../pages/Profile/Profile';

const Dashboard = () => React.createElement('div', { className: 'p-6 text-center' }, 'Dashboard reset�?�');

export const routes = [
  { path: '/auth/signin', element: React.createElement(SignIn) },
  { path: '/auth/signup', element: React.createElement(SignUp) },
  { path: '/auth/confirm', element: React.createElement(Confirm) },
  { path: '/auth/reset-password', element: React.createElement(ResetPassword) },
  {
    path: '/',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Welcome, { username: 'Murod' })),
  },
  {
    path: '/dashboard',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Dashboard)),
  },
  {
    path: '/habits',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Habits)),
  },
  {
    path: '/analytics',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Analytics)),
  },
  {
    path: '/goals',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Goals)),
  },
  {
    path: '/community',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Community)),
  },
  {
    path: '/notifications',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Notifications)),
  },
  {
    path: '/profile',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Profile)),
  },
  { path: '*', element: React.createElement(Navigate, { to: '/', replace: true }) },
];

function ProtectedRouteWrapper({ children }) {
  return React.createElement(ProtectedRoute, null, children);
}
