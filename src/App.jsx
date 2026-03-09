import { Routes, Route } from "react-router-dom";
import Layout from "@layouts/Layout";
import SEO from "@components/SEO/SEO";

import "./App.css";

function App() {
  return (
    <>
      <SEO />
      <Routes>
        <Route path="*" name="Home" element={<Layout />} />
      </Routes>
    </>
  );
}
  
export default App;
