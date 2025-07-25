import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import BarChartBox from "../components/BarChartBox";
import PieChartBox from "../components/PieChartBox";
import LineChartBox from "../components/LineChartBox";
import exportPDF, { exportToCSV } from "../utils/exportCSV";
import SummaryBlock from "../components/SummaryBlock";
import { useMediaQuery } from "react-responsive";
import EditSection from "../components/EditSection";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [msg, setMsg] = useState("");
  const dashboardRef = useRef();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [form, setForm] = useState({
    name: "",
    value: "",
    category: "",
    date: "",
  });

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("https://insightiq-earu.onrender.com/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    // const res = await fetch("http://localhost:5000/api/dashboard", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    const json = await res.json();
    const data = json.metrics || [];
    setMetrics(data);
    setFiltered(data);
    setCategories([...new Set(data.map((m) => m.category || "General"))]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("https://insightiq-earu.onrender.com/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    // const res = await fetch("http://localhost:5000/api/metrics", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(form),
    // });
    const json = await res.json();
    if (json.metric) {
      setMsg("✅ Metric added!");
      setForm({ name: "", value: "", category: "", date: "" });
      fetchData();
    } else {
      setMsg(json.message || "Something went wrong");
    }
  };

  const handleFilter = (category) => {
    setFilterCategory(category);

    let result = [...metrics];

    if (category !== "All") {
      result = result.filter((m) => m.category === category);
    }

    if (startDate) {
      result = result.filter((m) => new Date(m.date) >= new Date(startDate));
    }

    if (endDate) {
      result = result.filter((m) => new Date(m.date) <= new Date(endDate));
    }

    setFiltered(result);
  };

  const total = filtered.reduce((acc, curr) => acc + curr.value, 0);
  const avg = filtered.length ? (total / filtered.length).toFixed(2) : 0;

  const groupByCategory = () => {
    const grouped = {};
    filtered.forEach((m) => {
      const category = m.category || "General";
      grouped[category] = (grouped[category] || 0) + m.value;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  // const groupByMonthYear = () => {
  //   const grouped = {};
  //   filtered.forEach((m) => {
  //     const date = new Date(m.date);
  //     const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  //       2,
  //       "0"
  //     )}`;
  //     grouped[key] = (grouped[key] || 0) + m.value;
  //   });

  //   return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  // };

  const cardStyle = {
    padding: "20px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    minWidth: "200px",
    textAlign: "center",
  };

  const formStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "30px",
    padding: "25px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  };

  const inputStyle = {
    padding: "12px 15px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    width: isMobile ? "100%" : "auto",
  };

  const buttonStyle = {
    padding: "12px 20px",
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    width: isMobile ? "100%" : "auto",
  };

  return (
    <Layout>
      <h2
        style={{
          fontSize: isMobile ? "24px" : "32px",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        📊 InsightIQ Dashboard
      </h2>

      {/* Metric Form */}
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Metric name"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <input
          name="value"
          type="number"
          value={form.value}
          onChange={handleChange}
          placeholder="Value"
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          <option value="Sales">Sales</option>
          <option value="Users">Users</option>
          <option value="Engagement">Engagement</option>
          <option value="Marketing">Marketing</option>
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(59, 130, 246, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          ➕ Add Metric
        </button>
      </form>

      {msg && (
        <p
          style={{
            padding: "15px",
            background: msg.includes("✅") ? "#dcfce7" : "#fef2f2",
            color: msg.includes("✅") ? "#166534" : "#dc2626",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {msg}
        </p>
      )}

      {/* Edit Section */}
      <EditSection
        metrics={metrics}
        fetchData={fetchData}
        isMobile={isMobile}
      />

      {/* Summary Block */}
      <SummaryBlock />

      {/* Filters */}
      <div
        style={{
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          padding: "25px",
          borderRadius: "15px",
          marginBottom: "30px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "600", marginRight: "10px" }}>
            Filter by Category:{" "}
          </label>
          <select
            value={filterCategory}
            onChange={(e) => handleFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "15px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label style={{ fontWeight: "600" }}>Date Range:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={inputStyle}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={inputStyle}
          />
          <button
            onClick={() => handleFilter(filterCategory)}
            style={buttonStyle}
          >
            Apply Filter
          </button>
        </div>
      </div>

      <div ref={dashboardRef}>
        {/* Metric Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>📦</div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>
              {filtered.length}
            </div>
            <div>Total Metrics</div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #10B981, #059669)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>📈</div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{total}</div>
            <div>Total Value</div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>📊</div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>{avg}</div>
            <div>Average Value</div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "white",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>📅</div>
            <div style={{ fontSize: "28px", fontWeight: "bold" }}>
              {categories.length}
            </div>
            <div>Categories</div>
          </div>
        </div>

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          <BarChartBox
            data={filtered.map((m) => ({ name: m.name, value: m.value }))}
            title={"Metrics Overview"}
          />
          <PieChartBox
            data={groupByCategory()}
            type={"Category Distribution"}
          />
          <LineChartBox
            data={filtered.map((m) => ({
              name: m.date?.slice(0, 10),
              value: m.value,
            }))}
          />
          {/* <BarChartBox data={groupByMonthYear()} title="Monthly Metrics" /> */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <button
          onClick={() => exportToCSV(filtered)}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #10B981, #059669)",
            padding: "15px 30px",
            fontSize: "16px",
          }}
        >
          ⬇️ Export CSV
        </button>

        <button
          onClick={() => exportPDF(dashboardRef, "Dashboard Report")}
          style={{
            ...buttonStyle,
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            padding: "15px 30px",
            fontSize: "16px",
          }}
        >
          📄 Export PDF
        </button>
      </div>
    </Layout>
  );
}
