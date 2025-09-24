// src/pages/dashboard/Surveys.jsx
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../config'; // 👈 adjust path if needed

export default function Surveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId") || "guest";

  useEffect(() => {
    async function fetchSurveys() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/surveys?userId=${userId}`);
        const data = await res.json();
        setSurveys(data);
      } catch (err) {
        console.error("Error fetching surveys:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSurveys();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-gray-400">Loading surveys...</p>;
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white text-center">📝 Available Surveys</h1>

      {surveys.length === 0 ? (
        <p className="text-center text-gray-500">No surveys available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-purple-800 border border-blue-100 rounded-lg p-4 shadow"
            >
              <h2 className="text-lg font-semibold text-blue-700">{survey.title}</h2>
              <p className="text-sm text-white">⏱️ {survey.time}</p>
              <p className="text-sm text-green-600 font-medium">
                Reward: ₦{survey.reward}
              </p>
              <button
                onClick={() => window.open(survey.link, "_blank")} // 👈 open survey provider link
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                Start Survey
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
