import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import LineChartBox from "../components/LineChartBox";
import BarChartBox from "../components/BarChartBox";
import axios from "axios";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
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
      <div style={{ padding: "30px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>📈 Analytics</h2>
        <LineChartBox data={analyticsData} title="Monthly Trends" />
        <BarChartBox data={groupByMonthYear()} title="Monthly Metrics" />
      </div>
    </Layout>
  );
};

export default AnalyticsPage;