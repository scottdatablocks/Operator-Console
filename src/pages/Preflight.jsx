import React, { useEffect, useState } from "react";

export default function Preflight() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPreflight() {
      try {
        const res = await fetch("/data/status_latest.json");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        setReport(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPreflight();
  }, []);

  if (loading) return <div className="text-center mt-10">Running Preflight checks...</div>;
  if (error) return <div className="text-center mt-10 text-red-400">Error: {error}</div>;

  return (
    <div className="p-8 text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Preflight Validation Report</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <p><strong>Version:</strong> {report.version}</p>
        <p><strong>Timestamp:</strong> {report.timestamp}</p>
        <h2 className="text-xl mt-4 mb-2">Metrics</h2>
        <ul className="list-disc list-inside">
          {Object.entries(report.metrics || {}).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

