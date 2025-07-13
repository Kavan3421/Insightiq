import { useState, useEffect } from "react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState("light")
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light"
    setTheme(savedTheme)

    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      } else {
        setSidebarCollapsed(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

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
    marginLeft: isMobile ? "0" : (sidebarCollapsed ? "80px" : "280px"),
    transition: "margin-left 0.3s ease",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden"
  }

  const contentStyle = {
    flex: 1,
    padding: isMobile ? "15px" : "25px",
    background: theme === "light" ? "#ffffff" : "#1f2937",
    margin: isMobile ? "10px" : "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
    overflow: "auto",
  }

  return (
    <div style={containerStyle}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
        theme={theme} 
        isMobile={isMobile}
      />
      <div style={mainContentStyle}>
        <Navbar 
          isMobile={isMobile} 
          toggleSidebar={toggleSidebar} 
          sidebarCollapsed={sidebarCollapsed}
        />
        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  )
}

export default Layout