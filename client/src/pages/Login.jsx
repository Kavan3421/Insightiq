import { useState } from "react";
import { loginUser } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(form);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setMessage("✅ Logged in successfully!");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setMessage(res.message || res.error || "Login failed");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img
              src="/images/InsightIQ(1).png"
              alt="InsightIQ Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your InsightIQ account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
          <div className="password-wrapper">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-visibility"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`message ${
              message.includes("✅") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-logo {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          color: white;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
        }

        .login-header h2 {
          font-size: 26px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 6px;
        }

        .login-header p {
          color: #6b7280;
        }

        input {
          width: 100%;
          padding: 14px;
          font-size: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.8);
          margin-bottom: 20px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        input:focus {
          border-color: #3B82F6;
        }

        .password-wrapper {
          position: relative;
        }

        .toggle-visibility {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: #6b7280;
        }

        button[type="submit"] {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        button[type="submit"]:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        button[type="submit"]:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        .message {
          margin-top: 20px;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          text-align: center;
        }

        .message.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .signup-link {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .signup-link a {
          color: #3B82F6;
          font-weight: 600;
          text-decoration: none;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 20px;
          }

          .login-logo {
            width: 60px;
            height: 60px;
            font-size: 20px;
          }

          .login-header h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
