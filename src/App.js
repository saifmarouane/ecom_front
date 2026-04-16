import "./App.css";

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import ProtectedRoute from "./Components/ProtectedRoute";

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Products = lazy(() => import("./Pages/Products"));
const Category = lazy(() => import("./Pages/Category"));
const Blog = lazy(() => import("./Pages/Blog"));
const Contact = lazy(() => import("./Pages/Contact"));
const Cart = lazy(() => import("./Pages/Cart"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));

const Auth = lazy(() => import("./Pages/Auth"));

const AdminLayout = lazy(() => import("./Pages/AdminLayout"));
const Admin = lazy(() => import("./Pages/Admin"));
const AdminDashboard = lazy(() => import("./Pages/AdminDashboard"));
const AdminCategories = lazy(() => import("./Pages/AdminCategories"));
const AdminProducts = lazy(() => import("./Pages/AdminProducts"));
const AdminUsers = lazy(() => import("./Pages/AdminUsers"));
const AdminOrders = lazy(() => import("./Pages/AdminOrders"));

function RouteFallback() {
  return (
    <div className="route-guard" aria-busy="true">
      <div className="spinner" />
      <div>Loading…</div>
    </div>
  );
}



function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <main>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories/:id" element={<Category />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Navigate to="/login?mode=register" replace />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Admin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
