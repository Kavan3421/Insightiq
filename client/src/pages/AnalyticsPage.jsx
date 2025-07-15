import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LineChartBox from "../components/LineChartBox";
import BarChartBox from "../components/BarChartBox";
import axios from "axios";
import { useMediaQuery } from "react-responsive";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("https://insightiq-earu.onrender.com/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.metrics || [];
        setFiltered(data);
        setAnalyticsData(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
      }
    };

    fetchMetrics();
  }, []);

  const groupByMonthYear = () => {
    const grouped = {};
    filtered.forEach((m) => {
      const date = new Date(m.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      grouped[key] = (grouped[key] || 0) + m.value;
    });

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  return (
    <Layout>
      <div style={{ padding: isMobile ? "15px" : "30px" }}>
        <h2 style={{ 
          fontSize: isMobile ? "24px" : "28px", 
          fontWeight: "bold", 
          marginBottom: "20px" 
        }}>
          📈 Analytics
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <LineChartBox data={analyticsData} title="Monthly Trends" />
          <BarChartBox data={groupByMonthYear()} title="Monthly Metrics" />
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;