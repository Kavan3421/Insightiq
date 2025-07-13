import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = ({ toggleSidebar, isMobile }) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light"
    setTheme(saved)
    document.body.className = saved


    return () => clearInterval()
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.body.className = newTheme
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const navbarStyle = {
    background:
      theme === "light" ? "linear-gradient(135deg, #ffffff, #f8fafc)" : "linear-gradient(135deg, #1f2937, #111827)",
    padding: isMobile ? "12px 15px" : "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    borderBottom: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
  }

  const leftSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "12px" : "20px",
  }

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: isMobile ? "10px" : "15px",
  }

  const welcomeStyle = {
    color: theme === "light" ? "#1f2937" : "#f9fafb",
    fontSize: isMobile ? "14px" : "16px",
    fontWeight: "600",
    margin: 0,
  }

  const buttonStyle = {
    padding: isMobile ? "8px 12px" : "8px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }

  const themeButtonStyle = {
    ...buttonStyle,
    background:
      theme === "light" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "white",
  }

  const logoutButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
  }

  const menuButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    color: "white",
    display: isMobile ? "flex" : "none",
  }

  const userAvatarStyle = {
    width: isMobile ? "36px" : "40px",
    height: isMobile ? "36px" : "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: isMobile ? "14px" : "16px",
  }

  const logoStyle = {
    width: "36px",
    height: "36px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    borderRadius: "25%",
    display: isMobile ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  }

  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }

  return (
    <div style={navbarStyle}>
      <div style={leftSectionStyle}>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            style={menuButtonStyle}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            ☰
          </button>
        )}
        
        {isMobile && (
          <div style={logoStyle}>
            <img src="/images/InsightIQ(1).png" alt="Logo" style={imgStyle} />
          </div>
        )}

        <div>
          <p style={welcomeStyle}>Welcome back, {user?.name || "Guest"} 👋</p>
          {/* <p style={timeStyle}>{currentTime.toLocaleTimeString()}</p> */}
        </div>
      </div>

      <div style={rightSectionStyle}>
        <button
          onClick={toggleTheme}
          style={themeButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)"
            e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "none"
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
          {!isMobile && (theme === "light" ? "Dark" : "Light")}
        </button>

        <div style={userAvatarStyle}>{user?.name ? user.name.charAt(0).toUpperCase() : "G"}</div>

        <button
          onClick={handleLogout}
          style={logoutButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)"
            e.target.style.boxShadow = "0 5px 15px rgba(239, 68, 68, 0.3)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)"
            e.target.style.boxShadow = "none"
          }}
        >
          {isMobile ? "🚪" : "🚪 Logout"}
        </button>
      </div>
    </div>
  )
}

export default Navbar