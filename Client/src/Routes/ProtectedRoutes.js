import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  return token ? (
    <Outlet />
  ) : ( 
    <Navigate to="/login" replace state={{from: location}}/>
  );
}

export default ProtectedRoutes;