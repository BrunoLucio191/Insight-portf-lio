import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./components/Home/HomePage";
import Admin from "./components/admin/Admin";
import Painel from "./components/admin/painel";
import AuthProvider from "./components/Auth/AuthProvider";
import api from "./lib/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin setUser={setUser} />} />
        <Route path="/painel" element={<AuthProvider user={user}><Painel /></AuthProvider>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
