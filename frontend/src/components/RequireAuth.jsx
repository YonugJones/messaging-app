import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  
  return (
    // check if user has authToken attached to global auth
    auth?.accessToken

    // if so, let them through
      ? <Outlet />
      // if not, send them to the login route
      : <Navigate to='/login' state={{ from: location }} replace/>
  ); 
}

export default RequireAuth;