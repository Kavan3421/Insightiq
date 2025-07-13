import { useState } from "react"
import { useMediaQuery } from "react-responsive"

export default function MetricsTable({ data }) {
  const [sortKey, setSortKey] = useState("date")
  const [asc, setAsc] = useState(false)
  const [page, setPage] = useState(1)
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  const pageSize = isMobile ? 3 : 5

  const sorted = [...data].sort((a, b) => {
    const valA = a[sortKey]
    const valB = b[sortKey]

    if (typeof valA === "number") return asc ? valA - valB : valB - valA
    return asc ? valA?.localeCompare(valB) : valB?.localeCompare(valA)
  })

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(data.length / pageSize)

  const handleSort = (key) => {
    if (sortKey === key) setAsc(!asc)
    else {
      setSortKey(key)
      setAsc(true)
    }
  }

  const containerStyle = {
    marginTop: "30px",
    background: "linear-gradient(145deg, #ffffff, #f8fafc)",
    borderRadius: "15px",
    padding: isMobile ? "15px" : "25px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e2e8f0",
  }

  const titleStyle = {
    fontSize: isMobile ? "20px" : "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "20px",
    textAlign: "center",
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  }

  const headerStyle = {
    background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    color: "white",
  }

  const headerCellStyle = {
    padding: isMobile ? "10px 12px" : "15px 20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: isMobile ? "12px" : "14px",
    textAlign: "left",
    borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.3s ease",
  }

  const rowStyle = {
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.3s ease",
  }

  const cellStyle = {
    padding: isMobile ? "10px 12px" : "15px 20px",
    fontSize: isMobile ? "12px" : "14px",
    color: "#374151",
  }

  const paginationStyle = {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
  }

  const pageButtonStyle = (isActive) => ({
    padding: isMobile ? "6px 10px" : "8px 12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    background: isActive ? "linear-gradient(135deg, #3B82F6, #8B5CF6)" : "#ffffff",
    color: isActive ? "#ffffff" : "#374151",
    cursor: "pointer",
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    minWidth: "40px",
    textAlign: "center",
  })

  const statsStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isMobile ? "flex-start" : "center",
    marginBottom: "20px",
    padding: "15px",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    borderRadius: "10px",
    fontSize: isMobile ? "12px" : "14px",
    color: "#6b7280",
    gap: isMobile ? "8px" : "0",
  }

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>📋 Metrics Data Table</h3>

      <div style={statsStyle}>
        <span>
          <strong>Total Records:</strong> {data.length}
        </span>
        <span>
          <strong>Showing:</strong> {Math.min(pageSize, data.length - (page - 1) * pageSize)} of {data.length}
        </span>
        <span>
          <strong>Page:</strong> {page} of {totalPages}
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead style={headerStyle}>
            <tr>
              {["name", "value", "category", "date"].map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  style={{
                    ...headerCellStyle,
                    background: sortKey === key ? "rgba(255, 255, 255, 0.2)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = sortKey === key ? "rgba(255, 255, 255, 0.2)" : "transparent"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>{key.toUpperCase()}</span>
                    <span style={{ fontSize: "12px" }}>{sortKey === key ? (asc ? "🔼" : "🔽") : "↕️"}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((m, index) => (
              <tr
                key={m._id}
                style={{
                  ...rowStyle,
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#e0f2fe"
                  e.target.style.transform = "scale(1.01)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = index % 2 === 0 ? "#ffffff" : "#f8fafc"
                  e.target.style.transform = "scale(1)"
                }}
              >
                <td style={cellStyle}>
                  <div style={{ fontWeight: "600", color: "#1f2937" }}>{m.name}</div>
                </td>
                <td style={cellStyle}>
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#059669",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {m.value.toLocaleString()}
                  </div>
                </td>
                <td style={cellStyle}>
                  <span
                    style={{
                      padding: "4px 12px",
                      background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
                      color: "#1e40af",
                      borderRadius: "20px",
                      fontSize: isMobile ? "10px" : "12px",
                      fontWeight: "500",
                    }}
                  >
                    {m.category || "General"}
                  </span>
                </td>
                <td style={cellStyle}>
                  <div style={{ color: "#6b7280" }}>
                    {new Date(m.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={paginationStyle}>
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{
              ...pageButtonStyle(false),
              opacity: page === 1 ? 0.5 : 1,
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={pageButtonStyle(i + 1 === page)}
              onMouseEnter={(e) => {
                if (i + 1 !== page) {
                  e.target.style.background = "linear-gradient(135deg, #dbeafe, #bfdbfe)"
                  e.target.style.transform = "translateY(-2px)"
                }
              }}
              onMouseLeave={(e) => {
                if (i + 1 !== page) {
                  e.target.style.background = "#ffffff"
                  e.target.style.transform = "translateY(0)"
                }
              }}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{
              ...pageButtonStyle(false),
              opacity: page === totalPages ? 0.5 : 1,
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      )}

      {paginated.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#6b7280",
            fontSize: "16px",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <div style={{ fontWeight: "600", marginBottom: "8px" }}>No data available</div>
          <div>Add some metrics to see them here!</div>
        </div>
      )}
    </div>
  )
}