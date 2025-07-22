import { useState } from "react";

const EditSection = ({ metrics, fetchData, isMobile }) => {
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/metrics/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: editName, value: editValue }),
    });

    const json = await res.json();
    if (json.metric) {
      setEditId(null);
      setEditName("");
      setEditValue("");
      fetchData();
    } else {
      alert(json.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this metric?")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/api/metrics/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    if (json.message === "Metric deleted") {
      fetchData();
    } else {
      alert(json.message || "Failed to delete metric");
    }
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    width: "100%",
  };

  const buttonStyle = {
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    flex: 1,
    minWidth: isMobile ? "100%" : "auto",
  };

  return (
    <div
      style={{
        background: "linear-gradient(145deg, #ffffff, #f8fafc)",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "30px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ color: "#1f2937", marginBottom: "20px", fontSize: "20px" }}>
        ✏️ Edit Metrics
      </h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {metrics.map((m) => (
          <li
            key={m._id}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              padding: "15px",
              marginBottom: "15px",
              background: "#f9fafb",
              borderRadius: "10px",
            }}
          >
            {editId === m._id ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="New name"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="New value"
                    style={inputStyle}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => handleUpdate(m._id)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #10B981, #059669)",
                    }}
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditName("");
                      setEditValue("");
                    }}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #F59E0B, #D97706)",
                    }}
                  >
                    ❌ Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  {m.name} – {m.value}
                </span>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexDirection: isMobile ? "column" : "row",
                    width: isMobile ? "100%" : "auto",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditId(m._id);
                      setEditName(m.name);
                      setEditValue(m.value);
                    }}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m._id)}
                    style={{
                      ...buttonStyle,
                      background: "linear-gradient(135deg, #EF4444, #DC2626)",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditSection;
