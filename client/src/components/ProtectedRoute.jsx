import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { setRedirectAfterLogin } from '../store/slices/authSlice'

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      dispatch(setRedirectAfterLogin(location.pathname))
    }
  }, [user, location.pathname, dispatch])

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
