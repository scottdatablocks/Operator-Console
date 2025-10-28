import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Overview from "./pages/Overview";
import Nodes from "./pages/Nodes";
import Events from "./pages/Events";
import Preflight from "./pages/Preflight";
import Installer from "./pages/Installer";
import Logs from "./pages/Logs";
import About from "./pages/About";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/events" element={<Events />} />
          <Route path="/preflight" element={<Preflight />} />
          <Route path="/installer" element={<Installer />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Overview />} />
        </Routes>
      </Layout>
    </Router>
  );
}
