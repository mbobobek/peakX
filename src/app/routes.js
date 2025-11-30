import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import Confirm from '../pages/Auth/Confirm';
import ResetPassword from '../pages/Auth/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Habits from '../pages/Habits/Habits';

export const routes = [
  { path: '/auth/signin', element: React.createElement(SignIn) },
  { path: '/auth/signup', element: React.createElement(SignUp) },
  { path: '/auth/confirm', element: React.createElement(Confirm) },
  { path: '/auth/reset-password', element: React.createElement(ResetPassword) },
  {
    path: '/dashboard',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Dashboard)),
  },
  {
    path: '/habits',
    element: React.createElement(ProtectedRouteWrapper, null, React.createElement(Habits)),
  },
  {
    path: '/test',
    element: React.createElement(
      ProtectedRouteWrapper,
      null,
      React.createElement('div', { className: 'p-6 text-slate-900' }, 'Test')
    ),
  },
  { path: '/', element: React.createElement(Navigate, { to: '/dashboard', replace: true }) },
  { path: '*', element: React.createElement(Navigate, { to: '/dashboard', replace: true }) },
];

function ProtectedRouteWrapper({ children }) {
  return React.createElement(ProtectedRoute, null, children);
}
