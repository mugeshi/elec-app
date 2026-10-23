
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Components/HomePage";
import Apple from "./Components/Pages/Apple";
import ProductManagement from "./Components/ProductManagement";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/phones/apple" element={<Apple />} />
        <Route
  path="/admin/products" element={<ProductManagement />}/>
        <Route
  path="/admin/products"
  element={<ProductManagement />}
/>
      </Routes>
    </>
  );
}

export default App;
