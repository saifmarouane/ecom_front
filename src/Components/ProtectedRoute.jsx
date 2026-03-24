import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function ProtectedRoute({ children, role = "admin" }) {
  const { token, user, isReady, checking } = useAuth();
  const location = useLocation();

  if (!isReady || checking) {
    return (
      <div className="route-guard">
        <div className="spinner" />
        <p>Vérification de session...</p>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
