import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Brush,
  Area,
  AreaChart,
} from "recharts"

export default function LineChartBox({ data, title = "Trend Analysis" }) {
  const [chartType, setChartType] = useState("line")
  const [showBrush, setShowBrush] = useState(false)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)

  const sortedData = [...data].sort((a, b) => new Date(a.name) - new Date(b.name))

  const boxStyle = {
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
    position: "relative",
    overflow: "hidden",
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  }

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  }

  const controlsStyle = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  }

  const buttonStyle = {
    padding: "8px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    background: "white",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  }

  const activeButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "white",
    borderColor: "#3B82F6",
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
            border: "1px solid #e2e8f0",
          }}
        >
          <p style={{ fontWeight: "600", color: "#1f2937", margin: "0 0 8px 0" }}>📅 {label}</p>
          <p style={{ color: "#3B82F6", margin: 0, fontSize: "14px" }}>
            📈 Value: <span style={{ fontWeight: "bold" }}>{payload[0].value}</span>
          </p>
          {payload[0].payload.category && (
            <p style={{ color: "#6b7280", margin: "4px 0 0 0", fontSize: "12px" }}>
              Category: {payload[0].payload.category}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const handleDataPointClick = (data) => {
    setSelectedDataPoint(data)
  }

  const stats = {
    max: Math.max(...sortedData.map((d) => d.value)),
    min: Math.min(...sortedData.map((d) => d.value)),
    avg: (sortedData.reduce((sum, d) => sum + d.value, 0) / sortedData.length).toFixed(2),
    trend:
      sortedData.length > 1
        ? (((sortedData[sortedData.length - 1].value - sortedData[0].value) / sortedData[0].value) * 100).toFixed(1)
        : 0,
  }

  return (
    <div style={boxStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>📈 {title}</h3>
        <div style={controlsStyle}>
          <button style={chartType === "line" ? activeButtonStyle : buttonStyle} onClick={() => setChartType("line")}>
            Line
          </button>
          <button style={chartType === "area" ? activeButtonStyle : buttonStyle} onClick={() => setChartType("area")}>
            Area
          </button>
          <button style={showBrush ? activeButtonStyle : buttonStyle} onClick={() => setShowBrush(!showBrush)}>
            🔍 Zoom
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{stats.max}</div>
          <div style={{ fontSize: "11px", opacity: 0.9 }}>Maximum</div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{stats.min}</div>
          <div style={{ fontSize: "11px", opacity: 0.9 }}>Minimum</div>
        </div>
        <div
          style={{
            background: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>{stats.avg}</div>
          <div style={{ fontSize: "11px", opacity: 0.9 }}>Average</div>
        </div>
        <div
          style={{
            background: `linear-gradient(135deg, ${stats.trend >= 0 ? "#10B981, #059669" : "#EF4444, #DC2626"})`,
            color: "white",
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: "bold" }}>
            {stats.trend >= 0 ? "+" : ""}
            {stats.trend}%
          </div>
          <div style={{ fontSize: "11px", opacity: 0.9 }}>Trend</div>
        </div>
      </div>

      <div style={{ height: "350px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={sortedData} onClick={handleDataPointClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: "#8B5CF6" }}
              />
              {showBrush && <Brush dataKey="name" height={30} stroke="#3B82F6" />}
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </LineChart>
          ) : (
            <AreaChart data={sortedData} onClick={handleDataPointClick}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fill="url(#areaGradient)" />
              {showBrush && <Brush dataKey="name" height={30} stroke="#3B82F6" />}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {selectedDataPoint && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(59, 130, 246, 0.1)",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #3B82F6",
            fontSize: "12px",
          }}
        >
          <strong>Selected:</strong> {selectedDataPoint.name} - {selectedDataPoint.value}
        </div>
      )}
    </div>
  )
}
