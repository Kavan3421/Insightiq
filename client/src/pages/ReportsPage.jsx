// src/pages/ReportsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import exportPDF, { exportToCSV } from "../utils/exportCSV";
import MetricsTable from "../components/MetricsTable";
import axios from "axios";

const ReportsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.metrics || [];
        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <Layout>
      <div style={{ padding: "30px" }} >
        <h2
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}
        >
          📋 Reports
        </h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => exportToCSV(metrics)}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={() => exportPDF(reportRef, "Monthly Reports")}
            style={{
              padding: "10px 20px",
              background: "#10b981",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Export PDF
          </button>
        </div>
        <div ref={reportRef}>
          <MetricsTable data={metrics} />
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
