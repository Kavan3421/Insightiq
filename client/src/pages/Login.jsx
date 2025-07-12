import { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate } from "react-router-dom"; // ⬅️ Import

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ⬅️ Hook

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setMessage("✅ Logged in successfully!");
      navigate("/dashboard"); // ⬅️ Redirect
    } else {
      setMessage(res.message || res.error || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" onChange={handleChange} placeholder="Email" required /><br />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required /><br />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
