import { Routes, Route, Navigate, Link } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout.jsx'
import OwnerLayout from './layouts/OwnerLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { FiAlertTriangle } from 'react-icons/fi'

import Home from './pages/customer/Home.jsx'
import Hairstyles from './pages/customer/Hairstyles.jsx'
import HairstyleDetail from './pages/customer/HairstyleDetail.jsx'
import Salons from './pages/customer/Salons.jsx'
import SalonProfile from './pages/customer/SalonProfile.jsx'
import BookingFlow from './pages/customer/BookingFlow.jsx'
import Bookings from './pages/customer/Bookings.jsx'
import Favorites from './pages/customer/Favorites.jsx'
import Profile from './pages/customer/Profile.jsx'
import Login from './pages/customer/Login.jsx'
import Register from './pages/customer/Register.jsx'
import PhoneLogin from './pages/customer/PhoneLogin.jsx'
import ForgotPassword from './pages/customer/ForgotPassword.jsx'

import OwnerLogin from './pages/owner/OwnerLogin.jsx'
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx'
import OwnerBookings from './pages/owner/OwnerBookings.jsx'
import OwnerServices from './pages/owner/OwnerServices.jsx'
import OwnerSlots from './pages/owner/OwnerSlots.jsx'
import OwnerPortfolio from './pages/owner/OwnerPortfolio.jsx'
import OwnerProfile from './pages/owner/OwnerProfile.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminSalons from './pages/admin/AdminSalons.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import AdminHairstyles from './pages/admin/AdminHairstyles.jsx'

function NotFound() {
  return (
    <div className="container-mx flex min-h-screen flex-col items-center justify-center gap-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500 dark:bg-amber-900/20">
        <FiAlertTriangle className="h-7 w-7" />
      </span>
      <h1 className="text-2xl font-black text-ink-900 dark:text-white">Page not found</h1>
      <p className="text-sm text-ink-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* ---------- Customer ---------- */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/hairstyles" element={<Hairstyles />} />
        <Route path="/hairstyles/:id" element={<HairstyleDetail />} />
        <Route path="/salons" element={<Salons />} />
        <Route path="/salons/:id" element={<SalonProfile />} />
        <Route path="/book" element={<BookingFlow />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute role="customer">
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute role="customer">
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------- Customer auth ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login/phone" element={<PhoneLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- Salon Owner ---------- */}
      <Route path="/salon/login" element={<OwnerLogin />} />
      <Route element={<OwnerLayout />}>
        <Route
          path="/salon"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/bookings"
          element={
            <ProtectedRoute role="owner">
              <OwnerBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/services"
          element={
            <ProtectedRoute role="owner">
              <OwnerServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/slots"
          element={
            <ProtectedRoute role="owner">
              <OwnerSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/portfolio"
          element={
            <ProtectedRoute role="owner">
              <OwnerPortfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/salon/profile"
          element={
            <ProtectedRoute role="owner">
              <OwnerProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------- Admin ---------- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/salons"
          element={
            <ProtectedRoute role="admin">
              <AdminSalons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute role="admin">
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hairstyles"
          element={
            <ProtectedRoute role="admin">
              <AdminHairstyles />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ---------- Fallbacks ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}