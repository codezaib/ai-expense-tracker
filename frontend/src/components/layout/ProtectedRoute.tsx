import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../store/api/authApi";
import MainLayout from "./MainLayout";
import { PageLoader } from "../../App";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const { data, isLoading, isError } = useGetProfileQuery();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !data?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute;
