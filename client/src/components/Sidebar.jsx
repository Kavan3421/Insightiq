import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, setCollapsed, theme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("dashboard");

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) setActiveItem("dashboard");
    else if (path.includes("analytics")) setActiveItem("analytics");
    else if (path.includes("reports")) setActiveItem("reports");
    else if (path.includes("settings")) setActiveItem("settings");
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const sidebarStyle = {
    width: collapsed ? "80px" : "280px",
    height: "100vh",
    background:
      theme === "light"
        ? "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"
        : "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
    position: "fixed",
    left: 0,
    top: 0,
    transition: "width 0.3s ease",
    boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
    borderRight: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    padding: collapsed ? "20px 10px" : "25px 20px",
    borderBottom: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
    display: "flex",
    alignItems: "center",
    gap: "15px",
  };

  const logoStyle = {
    width: "45px",
    height: "45px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: "18px",
    flexShrink: 0,
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: theme === "light" ? "#1f2937" : "#f9fafb",
    margin: 0,
    opacity: collapsed ? 0 : 1,
    transition: "opacity 0.3s ease",
  };

  const menuStyle = {
    flex: 1,
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const menuItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: collapsed ? "15px 20px" : "15px 20px",
    margin: "0 10px",
    borderRadius: "12px",
    textDecoration: "none",
    color: isActive ? "#ffffff" : theme === "light" ? "#4b5563" : "#9ca3af",
    background: isActive
      ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
      : "transparent",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: isActive ? "600" : "500",
    position: "relative",
    overflow: "hidden",
  });

  const iconStyle = {
    fontSize: "20px",
    flexShrink: 0,
    width: "24px",
    textAlign: "center",
  };

  const textStyle = {
    opacity: collapsed ? 0 : 1,
    transition: "opacity 0.3s ease",
    whiteSpace: "nowrap",
  };

  const toggleButtonStyle = {
    position: "absolute",
    top: "50%",
    right: collapsed ? "-15px" : "-15px",
    transform: "translateY(-50%)",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    border: "none",
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    transition: "all 0.3s ease",
  };

  const footerStyle = {
    padding: "20px",
    borderTop: `1px solid ${theme === "light" ? "#e2e8f0" : "#374151"}`,
  };

  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard", path: "/dashboard" },
    { id: "analytics", icon: "📈", label: "Analytics", path: "/analytics" }, // ✅ fixed
    { id: "reports", icon: "📋", label: "Reports", path: "/reports" }, // ✅ fixed
    { id: "settings", icon: "⚙️", label: "Settings", path: "/settings" }, // ✅ fixed
  ];

  return (
    <div style={sidebarStyle}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={toggleButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        {collapsed ? "→" : "←"}
      </button>

      <div style={headerStyle}>
        <div style={logoStyle}>IQ</div>
        {!collapsed && <h2 style={titleStyle}>InsightIQ</h2>}
      </div>

      <div style={menuStyle}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            style={menuItemStyle(activeItem === item.id)}
            onClick={() => setActiveItem(item.id)}
            onMouseEnter={(e) => {
              if (activeItem !== item.id) {
                e.target.style.background =
                  theme === "light"
                    ? "rgba(59, 130, 246, 0.1)"
                    : "rgba(59, 130, 246, 0.2)";
                e.target.style.transform = "translateX(5px)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeItem !== item.id) {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateX(0)";
              }
            }}
          >
            <span style={iconStyle}>{item.icon}</span>
            <span style={textStyle}>{item.label}</span>
          </Link>
        ))}
      </div>

      <div style={footerStyle}>
        <button
          onClick={handleLogout}
          style={{
            ...menuItemStyle(false),
            width: "100%",
            border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "white",
            margin: 0,
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          <span style={iconStyle}>🚪</span>
          <span style={textStyle}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
