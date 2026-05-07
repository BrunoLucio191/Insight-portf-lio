import { Navigate } from "react-router-dom";

function AuthProvider({ user, children }) {
  if (user === null) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

export default AuthProvider;
