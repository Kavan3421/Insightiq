import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    const { name, email, password } = form;
    const res = await registerUser({ name, email, password });

    console.log(res.token)
    if (res.token) {
      // Save token & user
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      navigate("/dashboard");
    } else {
      setMessage(res.message || res.error || "Signup failed");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          placeholder="Name"
          required
        /><br />
        <input
          name="email"
          type="email"
          onChange={handleChange}
          placeholder="Email"
          required
        /><br />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          required
        /><br />
        <input
          name="confirmPassword"
          type="password"
          onChange={handleChange}
          placeholder="Confirm Password"
          required
        /><br />
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
