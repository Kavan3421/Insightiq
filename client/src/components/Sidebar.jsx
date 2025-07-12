import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <h2>InsightIQ</h2>
      <ul>
        <li><Link to="/dashboard">📊 Dashboard</Link></li>
        <li><button onClick={handleLogout}>🚪 Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
