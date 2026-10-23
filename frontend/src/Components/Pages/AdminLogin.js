
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    // Temporary demo credentials only.
    if (username === "admin" && password === "Nivo@1234") {
      sessionStorage.setItem("nivoAdminLoggedIn", "true");
      navigate("/admin/products");
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <h1>Nivo <span>Tronics</span></h1>
        <p className="login-subtitle">Administrator sign in</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit">Sign In</button>

        <p className="login-footer">
          Authorized personnel only
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;
