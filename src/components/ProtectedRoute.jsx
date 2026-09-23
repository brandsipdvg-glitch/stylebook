import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ScreenLoader } from './Loader.jsx'

export default function ProtectedRoute({ children, role }) {
  const { isAuthed, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <ScreenLoader />

  const requiredRole = role || 'customer'
  const hasRole =
    requiredRole === 'customer'
      ? isAuthed
      : requiredRole === 'owner'
        ? user?.role === 'owner' || user?.role === 'admin'
        : user?.role === 'admin'

  if (!isAuthed) {
    const loginPath =
      requiredRole === 'owner'
        ? '/salon/login'
        : requiredRole === 'admin'
          ? '/admin/login'
          : '/login'
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
  }
  if (!hasRole) return <Navigate to="/" replace />
  return children
}