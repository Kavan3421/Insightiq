import { useEffect, useState } from "react";

export default function SummaryBlock() {
  const [summary, setSummary] = useState("");
  const [formatted, setFormatted] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSummary(data.summary || "");
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    if (summary) {
      setFormatted(formatSummary(summary));
    }
  }, [summary]);

  const formatSummary = (text) => {
    const sentences = text.split(/(?<=\.)\s+/);
    let used = new Set();

    const matchUnique = (keywords) =>
      sentences.find((s) => {
        const lower = s.toLowerCase();
        const isMatch = keywords.some((k) => lower.includes(k));
        const isNew = !used.has(s);
        if (isMatch && isNew) {
          used.add(s);
          return true;
        }
        return false;
      });

    const overview = matchUnique([
      "distribution",
      "mixed performance",
      "overview",
    ]);
    const sales = matchUnique(["sales"]);
    const marketing = matchUnique(["marketing"]);
    const general = matchUnique(["general"]);
    const recommendation = sentences
      .filter(
        (s) =>
          (s.toLowerCase().includes("recommend") ||
            s.toLowerCase().includes("should")) &&
          !used.has(s)
      )
      .map((s) => {
        used.add(s);
        return s;
      })
      .join(" ");

    return (
      <div
        style={{
          marginTop: "30px",
          padding: "25px",
          borderRadius: "12px",
          background: "linear-gradient(145deg, #ffffff, #f8fafc)",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h3
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px" }}
        >
          🧠 AI Insight Summary
        </h3>

        {overview && (
          <p style={{ fontSize: "16px", color: "#374151", lineHeight: 1.7 }}>
            <strong>📊 Overview:</strong> {overview}
          </p>
        )}

        {sales && (
          <p style={{ fontSize: "16px", color: "#10B981", lineHeight: 1.7 }}>
            <strong>💹 Sales Insight:</strong> {sales}
          </p>
        )}

        {marketing && (
          <p style={{ fontSize: "16px", color: "#DC2626", lineHeight: 1.7 }}>
            <strong>📉 Marketing Alert:</strong> {marketing}
          </p>
        )}

        {general && (
          <p style={{ fontSize: "16px", color: "#F59E0B", lineHeight: 1.7 }}>
            <strong>⚖️ General Metrics:</strong> {general}
          </p>
        )}

        {recommendation && (
          <p style={{ fontSize: "16px", color: "#2563EB", lineHeight: 1.7 }}>
            <strong>🧩 Recommendation:</strong> {recommendation}
          </p>
        )}
      </div>
    );
  };

  return formatted;
}
