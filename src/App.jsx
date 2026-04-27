import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/Home/HomePage";
import Admin from "./components/admin/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
