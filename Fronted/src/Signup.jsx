import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      navigate("/login");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="text" name="username" placeholder="Username" required value={formData.username} onChange={handleChange}/>
        <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange}/>
        <input type="password" name="password" placeholder="Password" required value={formData.password} onChange={handleChange}/>
        <button type="submit">Signup</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Signup;
