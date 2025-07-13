import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)
  }, [])

  const containerStyle = {
    display: "flex",
    minHeight: "100vh",
    background:
      theme === "light"
        ? "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
        : "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
  }

  const mainContentStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginLeft: sidebarCollapsed ? "80px" : "280px",
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
  }

  const contentStyle = {
    flex: 1,
    padding: "25px",
    background: theme === "light" ? "#ffffff" : "#1f2937",
    margin: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
    overflow: "auto",
  }

  // Mobile responsive
  const isMobile = window.innerWidth <= 768

  if (isMobile) {
    mainContentStyle.marginLeft = sidebarCollapsed ? "0" : "0"
  }

  return (
    <div style={containerStyle}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} theme={theme} />
      <div style={mainContentStyle}>
        <Navbar />
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  )
}

export default Layout
