
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Components/HomePage";
import Apple from "./Components/Pages/Apple";
import ProductManagement from "./Components/ProductManagement";
import AdminLogin from "./Components/Pages/AdminLogin";

function ProtectedAdmin() {
  const isLoggedIn =
    sessionStorage.getItem("nivoAdminLoggedIn") === "true";

  return isLoggedIn ? (
    <ProductManagement />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phones/apple" element={<Apple />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/products"
          element={<ProtectedAdmin />}
        />
      </Routes>
    </>
  );
}

export default App;
