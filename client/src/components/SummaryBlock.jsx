import { useEffect, useState } from "react";

export default function SummaryBlock() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const res = await fetch("https://api/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setSummary(data.summary || null);
      } catch (e) {
        console.error("Failed to fetch summary:", e);
        setError("Could not load AI summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="my-8 p-6 rounded-xl bg-white shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="my-8 p-6 rounded-xl bg-red-50 text-red-700">{error}</div>;
  }

  if (!summary || typeof summary !== 'object' || !summary.executiveSummary) {
    return null;
  }

  return (
    <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-white to-slate-50 shadow-lg space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">
        🧠 AI-Powered Deep Dive
      </h3>

      {summary.executiveSummary && (
        <div className="p-4 bg-slate-100 rounded-lg">
          <h4 className="font-bold text-lg text-slate-700 mb-2">Executive Summary</h4>
          <p className="text-base text-gray-700 leading-relaxed">{summary.executiveSummary}</p>
        </div>
      )}

      {summary.performanceHighlights && (
        <div>
          <h4 className="font-bold text-lg text-slate-700 mb-3">Performance Highlights</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {summary.performanceHighlights.topCategory?.name && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="font-semibold text-green-800">🚀 Top Performer: {summary.performanceHighlights.topCategory.name}</p>
                <p className="text-green-700 mt-1">{summary.performanceHighlights.topCategory.insight}</p>
              </div>
            )}
            {summary.performanceHighlights.bottomCategory?.name && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="font-semibold text-red-800">📉 Needs Attention: {summary.performanceHighlights.bottomCategory.name}</p>
                <p className="text-red-700 mt-1">{summary.performanceHighlights.bottomCategory.insight}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {summary.keyTrends?.length > 0 && (
        <div>
          <h4 className="font-bold text-lg text-slate-700 mb-2">Key Trends</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
            {summary.keyTrends.map((trend, index) => (
              <li key={index}>{trend}</li>
            ))}
          </ul>
        </div>
      )}

      {summary.actionableRecommendations?.length > 0 && (
        <div>
          <h4 className="font-bold text-lg text-slate-700 mb-3">Actionable Recommendations</h4>
          <div className="space-y-3">
            {summary.actionableRecommendations.map((rec, index) => (
              <div key={index} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-800">{rec.title}</p>
                <p className="text-blue-700 mt-1">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}