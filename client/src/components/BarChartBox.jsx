import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const BarChartBox = ({ data, title }) => {
  const boxStyle = {
    width: "100%",
    height: "400px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  }

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
    textAlign: "center",
  }

  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>📊 {title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="value" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartBox
