import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const authToken = Cookies.get("jwtToken");
  if (authToken === undefined) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
