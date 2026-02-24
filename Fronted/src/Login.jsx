import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      //https://chatyaar-4.onrender.com/login
      const res = await fetch("https://chatyaar-4.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

      navigate("/chat");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Left Panel */}
        <div className="left-panel">
          <h1>Welcome Back</h1>
          <p>Login to continue your conversations on ChatYaar.</p>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h2>Sign In</h2>

          {message && <div className="error-box">{message}</div>}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <button type="submit">Login</button>
          </form>

          <p className="signup-link">
            Don’t have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;