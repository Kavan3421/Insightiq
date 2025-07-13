import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const [theme, setTheme] = useState("light")
  const [currentTime, setCurrentTime] = useState(new Date())
  // const [notifications, setNotifications] = useState(3)

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light"
    setTheme(saved)
    document.body.className = saved

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
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
    padding: "15px 25px",
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
    gap: "20px",
  }

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  }

  const welcomeStyle = {
    color: theme === "light" ? "#1f2937" : "#f9fafb",
    fontSize: "16px",
    fontWeight: "600",
  }

  const timeStyle = {
    color: theme === "light" ? "#6b7280" : "#9ca3af",
    fontSize: "14px",
    fontFamily: "monospace",
  }

  const buttonStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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

  // const notificationStyle = {
  //   position: "relative",
  //   padding: "8px",
  //   background: theme === "light" ? "#f3f4f6" : "#374151",
  //   borderRadius: "8px",
  //   cursor: "pointer",
  //   transition: "all 0.3s ease",
  // }

  // const badgeStyle = {
  //   position: "absolute",
  //   top: "-5px",
  //   right: "-5px",
  //   background: "#ef4444",
  //   color: "white",
  //   borderRadius: "50%",
  //   width: "18px",
  //   height: "18px",
  //   fontSize: "10px",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   fontWeight: "bold",
  // }

  const userAvatarStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  }

  return (
    <div style={navbarStyle}>
      <div style={leftSectionStyle}>
        <div>
          <p style={welcomeStyle}>Welcome back, {user?.name || "Guest"} 👋</p>
          <p style={timeStyle}>{currentTime.toLocaleString()}</p>
        </div>
      </div>

      <div style={rightSectionStyle}>
        {/* <div
          style={notificationStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)"
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)"
          }}
        >
          🔔{notifications > 0 && <div style={badgeStyle}>{notifications}</div>}
        </div> */}

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
          {theme === "light" ? "Dark" : "Light"}
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
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar
