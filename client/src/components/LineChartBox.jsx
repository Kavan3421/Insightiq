import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function LineChartBox({ data }) {
  // Expecting data = [{ name: '2025-07-11', value: 20 }, { name: '2025-07-12', value: 30 }]
  const sortedData = [...data].sort((a, b) => new Date(a.name) - new Date(b.name));

  return (
    <div style={boxStyle}>
      <h3>📈 Trend Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00b894" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const boxStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
};
