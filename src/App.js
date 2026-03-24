import "./App.css";

import { Routes, Route } from "react-router-dom";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Products from "./Pages/Products";
import Category from "./Pages/Category";
import Blog from "./Pages/Blog";
import Contact from "./Pages/Contact";
import Admin from "./Pages/Admin";
import AdminDashboard from "./Pages/AdminDashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import Auth from "./Pages/Auth";
import { Navigate } from "react-router-dom";
import AdminLayout from "./Pages/AdminLayout";
import AdminCategories from "./Pages/AdminCategories";
import AdminProducts from "./Pages/AdminProducts";
import AdminUsers from "./Pages/AdminUsers";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";

function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <main>
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
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
