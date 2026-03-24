import React from "react";
import { Navigate } from "react-router-dom";

// Keep /admin working by redirecting to the real dashboard route
const Admin = () => <Navigate to="/admin/dashboard" replace />;

export default Admin;
