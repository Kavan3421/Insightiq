import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useMediaQuery } from "react-responsive";

const SettingsPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <Layout>
      <div style={{ padding: isMobile ? "15px" : "30px" }}>
        <h2 style={{ 
          fontSize: isMobile ? "24px" : "28px", 
          fontWeight: "bold", 
          marginBottom: "20px" 
        }}>
          ⚙️ Settings
        </h2>

        <div style={{ 
          marginBottom: "20px",
          padding: "20px",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          borderRadius: "12px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}>
          <h3 style={{ marginBottom: "10px", fontSize: "18px" }}>Profile Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;