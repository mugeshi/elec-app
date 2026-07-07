import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import HomePage from "./Components/HomePage";

function App() {
  return (
    <>
   
      <Navbar />
      <HomePage/>

      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;