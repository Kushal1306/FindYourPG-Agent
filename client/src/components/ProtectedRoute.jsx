import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children ,status = true }) => {
  const token = Cookies.get('access_token');
  
  if (!token && status) {
    return <Navigate to="/signin" replace />;
  }

    
  if (token && !status) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;