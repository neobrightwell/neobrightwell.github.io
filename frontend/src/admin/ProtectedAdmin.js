import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";

export default function ProtectedAdmin({ children }) {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[rgba(199,194,184,0.55)] font-mono text-[11px]">
        Opening the archive…
      </div>
    );
  }
  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }
  return children;
}
