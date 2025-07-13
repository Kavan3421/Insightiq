import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useMediaQuery } from "react-responsive"

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"]

const PieChartBox = ({ data, type }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })

  const boxStyle = {
    width: "100%",
    height: isMobile ? "300px" : "400px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    padding: isMobile ? "15px" : "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  }

  const titleStyle = {
    fontSize: isMobile ? "18px" : "20px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
    textAlign: "center",
  }

  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>🥧 {type}</h3>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={isMobile ? 70 : 90} // Slightly reduced to make space for legend
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              fontSize: isMobile ? "12px" : "14px",
            }}
          />
          <Legend 
            layout="vertical" // Always vertical
            verticalAlign="middle" // Center vertically
            align="right" // Position on the right side
            wrapperStyle={{
              paddingLeft: "20px", // Add some space between chart and legend
              fontSize: isMobile ? "12px" : "14px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PieChartBox