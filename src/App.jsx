import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Nodes from "./pages/Nodes";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Harmonix from "./pages/Harmonix";
import Preflight from "./pages/Preflight";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/harmonix" element={<Harmonix />} />
          <Route path="/preflight" element={<Preflight />} />
        </Routes>
      </Layout>
    </Router>
  );
}

