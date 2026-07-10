import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
