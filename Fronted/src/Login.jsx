import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/chat");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back 👋</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange}/>
          <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange}/>
          <button type="submit">Login</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <Link to="/signup" className="link">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
}

export default Login;
