import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { registerUser } from "../utils/api"

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match")
      setLoading(false)
      return
    }

    try {
      const { name, email, password } = form
      const res = await registerUser({ name, email, password })

      if (res.token) {
        localStorage.setItem("token", res.token)
        localStorage.setItem("user", JSON.stringify(res.user))
        setMessage("✅ Account created successfully!")
        setTimeout(() => navigate("/dashboard"), 1000)
      } else {
        setMessage(res.message || res.error || "Signup failed")
      }
    } catch (error) {
      setMessage("Network error. Please try again.", error)
    } finally {
      setLoading(false)
    }
  }

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  }

  const cardStyle = {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  }

  const logoStyle = {
    width: "80px",
    height: "80px",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    borderRadius: "50%",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "white",
  }

  const inputStyle = {
    width: "100%",
    padding: "15px",
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "20px",
    outline: "none",
    transition: "all 0.3s ease",
    background: "rgba(255, 255, 255, 0.8)",
  }

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    background: loading ? "#94a3b8" : "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: loading ? "not-allowed" : "pointer",
    transition: "all 0.3s ease",
    transform: loading ? "none" : "translateY(0)",
  }

  const messageStyle = {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "14px",
    background: message.includes("✅") ? "#dcfce7" : "#fef2f2",
    color: message.includes("✅") ? "#166534" : "#dc2626",
    border: `1px solid ${message.includes("✅") ? "#bbf7d0" : "#fecaca"}`,
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={logoStyle}>IQ</div>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1f2937", marginBottom: "8px" }}>
            Create Account
          </h2>
          <p style={{ color: "#6b7280" }}>Join InsightIQ for advanced analytics</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />

          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.boxShadow = "0 10px 20px rgba(59, 130, 246, 0.3)"
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "none"
            }}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #ffffff",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginRight: "10px",
                  }}
                ></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {message && <div style={messageStyle}>{message}</div>}

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ color: "#6b7280" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#3B82F6",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}
