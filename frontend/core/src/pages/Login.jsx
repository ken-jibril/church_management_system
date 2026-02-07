import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/register/login/", { username, password });
      // This assumes your backend returns user info + token
      login(response.data); 
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div>
      <h1>LOGIN PAGE IS WORKING 🔥</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
