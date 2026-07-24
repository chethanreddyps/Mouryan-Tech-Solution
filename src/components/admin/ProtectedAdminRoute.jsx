import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAdminToken } from '../../utils/adminAuth';

const ProtectedAdminRoute = () => {
  if (!getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
