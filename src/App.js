import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Navbar from "./components/Navbar";
import CartSidebar from "./components/CartSidebar";

import ServicesPage from "./pages/ServicesPage";
import SlotSelectionPage from "./pages/SlotSelectionPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminAvailability from "./pages/admin/AdminAvailability";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" style={{ color: "var(--primary)" }} />
      </div>
    );
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <CartSidebar />
    {children}
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <PublicLayout>
                  <ServicesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/slot-selection"
              element={
                <PublicLayout>
                  <SlotSelectionPage />
                </PublicLayout>
              }
            />
            <Route
              path="/customer-details"
              element={
                <PublicLayout>
                  <CustomerDetailsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/booking-summary/:ref"
              element={
                <PublicLayout>
                  <BookingSummaryPage />
                </PublicLayout>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="availability" element={<AdminAvailability />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
