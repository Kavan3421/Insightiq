// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

const SettingsPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);


  return (
    <Layout>
      <div style={{ padding: "30px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>⚙️ Settings</h2>

        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Profile Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

      </div>
    </Layout>
  );
};

export default SettingsPage;
