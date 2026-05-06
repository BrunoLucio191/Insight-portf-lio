import { Navigate } from "react-router-dom";

//Componente bem simples, aceita children, ou seja, tudo que esta
//passado por dentro dele, nesse caso painel, e so renderiza se setUser != null
function AuthProvider({ setUser, children }) {
  if (setUser === null) return <Navigate to="/Admin" replace />;
  
  return <>{children}</>;
}

export default AuthProvider;
