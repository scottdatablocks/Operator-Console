import React, { useEffect, useState } from "react";

export default function Harmonix() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/status.json");
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading Harmonix data...</div>;
  if (error) return <div className="text-center mt-10 text-red-400">Error: {error}</div>;

  return (
    <div className="p-8 text-gray-200">
      <h1 className="text-2xl font-bold mb-4">Harmonix System Status</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <p><strong>Version:</strong> {data.version}</p>
        <p><strong>Uptime:</strong> {data.uptime}</p>
        <p><strong>Timestamp:</strong> {data.timestamp}</p>
        <h2 className="text-xl mt-4 mb-2">Services</h2>
        <ul className="list-disc list-inside">
          {Object.entries(data.services || {}).map(([key, value]) => (
            <li key={key}>{key}: {value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

