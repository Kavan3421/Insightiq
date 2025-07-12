import { useState } from "react";

export default function MetricsTable({ data }) {
  const [sortKey, setSortKey] = useState("date");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const sorted = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "number") return asc ? valA - valB : valB - valA;
    return asc
      ? valA?.localeCompare(valB)
      : valB?.localeCompare(valA);
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(data.length / pageSize);

  const handleSort = (key) => {
    if (sortKey === key) setAsc(!asc);
    else {
      setSortKey(key);
      setAsc(true);
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📋 All Metrics (Sorted + Paginated)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["name", "value", "category", "date"].map((key) => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                style={{ borderBottom: "1px solid #ccc", cursor: "pointer", padding: "10px" }}
              >
                {key.toUpperCase()} {sortKey === key ? (asc ? "🔼" : "🔽") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.map((m) => (
            <tr key={m._id}>
              <td style={cell}>{m.name}</td>
              <td style={cell}>{m.value}</td>
              <td style={cell}>{m.category}</td>
              <td style={cell}>{new Date(m.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              marginRight: "5px",
              padding: "5px 10px",
              background: i + 1 === page ? "#333" : "#eee",
              color: i + 1 === page ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

const cell = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
