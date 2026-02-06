import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Login</Link>
      <Link to="/register" style={{ marginRight: "1rem" }}>Register</Link>

      {user && (
        <>
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
