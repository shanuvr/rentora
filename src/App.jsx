import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import Products from './pages/customer/Products';
import Cart from './pages/customer/Cart';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';

// Owner / Admin Portal
import AdminLayout from './layouts/AdminLayout';
import AdminBookings from './pages/admin/Bookings';
import AdminUndelivered from './pages/admin/Undelivered';
import AdminBilling from './pages/admin/Billing';
import AdminAccounts from './pages/admin/Accounts';
import AdminSettings from './pages/admin/Settings';

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

        {/* Owner / Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Default landing page is Bookings as requested */}
          <Route index element={<AdminBookings />} />
          <Route path="bookings" element={<Navigate to="/admin" replace />} />
          <Route path="undelivered" element={<AdminUndelivered />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="accounts" element={<AdminAccounts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
