import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import Products from './pages/customer/Products';
import Cart from './pages/customer/Cart';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin Route Placeholder */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
