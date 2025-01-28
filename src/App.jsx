import { Routes, Route } from "react-router-dom";
import Layout from "@layouts/Layout";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" name="Home" element={<Layout />} />
      </Routes>
    </>
  );
}
  
export default App;
