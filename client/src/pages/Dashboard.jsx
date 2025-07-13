import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import BarChartBox from "../components/BarChartBox";
import PieChartBox from "../components/PieChartBox";
import LineChartBox from "../components/LineChartBox";
import MetricsTable from "../components/MetricsTable";
import exportPDF, { exportToCSV } from "../utils/exportCSV";

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dashboardRef = useRef();

  const [form, setForm] = useState({
    name: "",
    value: "",
    category: "",
    date: "",
  });
  const [msg, setMsg] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    const data = json.metrics || [];
    setMetrics(data);
    setFiltered(data);
    setCategories([...new Set(data.map((m) => m.category || "General"))]);
  };

  // const fetchSummary = () => {
  //   const token = localStorage.getItem("token");
  //   fetch("http://localhost:5000/api/summary", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((json) => setSummary(json.summary || "No summary generated"))
  //     .catch((err) => console.error("Summary error:", err));
  // };

  useEffect(() => {
    fetchData();
    // fetchSummary();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
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

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/metrics/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName }),
    });

    const json = await res.json();

    if (json.metric) {
      setEditId(null);
      setEditName("");
      fetchData(); // Refresh updated data
    } else {
      alert(json.message || "Update failed");
    }
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
    <div ref={dashboardRef}>
      <Layout>
        <h2>📊 InsightIQ Dashboard</h2>

        {/* Metric Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Metric name"
            required
          />
          <input
            name="value"
            type="number"
            value={form.value}
            onChange={handleChange}
            placeholder="Value"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
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
          />
          <button type="submit">➕ Add</button>
        </form>
        <p>{msg}</p>

        <h3>Edit Metric Names</h3>
        <ul>
          {metrics.map((m) => (
            <li key={m._id}>
              {editId === m._id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="New name"
                  />
                  <button onClick={() => handleUpdate(m._id)}>💾 Save</button>
                  <button onClick={() => setEditId(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  {m.name} – {m.value}
                  <button
                    onClick={() => {
                      setEditId(m._id);
                      setEditName(m.name);
                    }}
                  >
                    ✏️ Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Filters */}
        <div style={{ marginTop: "20px" }}>
          <label>Filter by Category: </label>
          <select
            value={filterCategory}
            onChange={(e) => handleFilter(e.target.value)}
          >
            <option value="All">All</option>
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <label>Date Range:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={() => handleFilter(filterCategory)}>Apply</button>
        </div>

        {/* Metric Summary Cards */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={cardStyle}>
            📦 Total Metrics: <strong>{filtered.length}</strong>
          </div>
          <div style={cardStyle}>
            📈 Total Value: <strong>{total}</strong>
          </div>
          <div style={cardStyle}>
            📊 Average Value: <strong>{avg}</strong>
          </div>
          <div style={cardStyle}>
            📅 Categories: <strong>{categories.length}</strong>
          </div>
        </div>

        <PieChartBox data={groupByCategory()} type={"Category"} />

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          <BarChartBox
            data={filtered.map((m) => ({ name: m.name, value: m.value }))}
            title={"Metric"}
          />
          <PieChartBox
            data={filtered.map((m) => ({ name: m.name, value: m.value }))}
            type={"Metric"}
          />
          <LineChartBox
            data={filtered.map((m) => ({
              name: m.date?.slice(0, 10),
              value: m.value,
            }))}
          />
          <BarChartBox data={groupByMonthYear()} title="Monthly Metrics" />
        </div>

        <MetricsTable data={filtered} />
        <button onClick={() => exportToCSV(filtered)}>⬇️ Export CSV</button>
        <button
          onClick={() => exportPDF(dashboardRef)}
          style={{ margin: "20px 0" }}
        >
          📄 Export Full Analysis to PDF
        </button>

        {/* Summary */}
        {/* {summary && (
        <div
          style={{
            marginTop: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#f8f8f8",
          }}
        >
          <h3>🧠 AI Insight Summary</h3>
          <p>{summary}</p>
        </div>
      )} */}
      </Layout>
    </div>
  );
}

const cardStyle = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  minWidth: "200px",
};
