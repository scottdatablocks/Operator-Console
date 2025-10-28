import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh", backgroundColor: "#111" }}>
      <aside
        style={{
          width: "320px",
          background: "#0a0b0f",
          color: "#00ffe1",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 12px rgba(0,255,225,0.1)",
        }}
      >
        <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>🧱 Data Blocks Operator Console</h1>
        <p style={{ fontSize: "0.9rem", color: "#bbb" }}>Monitor • Validate • Deploy • Preflight</p>
        <nav style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link to="/" style={navStyle}>Home</Link>
          <Link to="/docs" style={navStyle}>Docs</Link>
          <Link to="/nodes" style={navStyle}>Nodes</Link>
          <Link to="/about" style={navStyle}>About</Link>
          <Link to="/contact" style={navStyle}>Contact</Link>
          <Link to="/harmonix" style={navStyle}>Harmonix</Link>
          <Link to="/preflight" style={navStyle}>Preflight</Link>
        </nav>
        <footer style={{ marginTop: "auto", fontSize: "0.8rem", color: "#666" }}>
          © {new Date().getFullYear()} Data Blocks LLC<br />Powered by Harmonix™
        </footer>
      </aside>

      <main style={{ flexGrow: 1, background: "#141517", padding: "2rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

const navStyle = {
  color: "#00ffe1",
  textDecoration: "none",
  fontSize: "1rem",
  padding: "0.4rem 0.8rem",
  borderRadius: "8px",
  backgroundColor: "#0f1116",
  border: "1px solid #00ffe122",
  transition: "background 0.2s",
};

