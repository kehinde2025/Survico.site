// src/pages/dashboard/Surveys.jsx
import { useEffect, useState } from 'react';

export default function Surveys() {
  const [surveys, setSurveys] = useState([]);

  // Fake survey data (replace with API later)
  useEffect(() => {
    setSurveys([
      {
        id: 1,
        title: 'Opinion on E-commerce in Nigeria',
        reward: 100,
        time: '3–5 min',
      },
      {
        id: 2,
        title: 'Your Streaming Preferences',
        reward: 80,
        time: '2–3 min',
      },
      {
        id: 3,
        title: 'Mobile App Usage in 2025',
        reward: 120,
        time: '4–6 min',
      },
    ]);
  }, []);

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
              className="bg-white border border-blue-100 rounded-lg p-4 shadow"
            >
              <h2 className="text-lg font-semibold text-blue-700">{survey.title}</h2>
              <p className="text-sm text-gray-500">⏱️ {survey.time}</p>
              <p className="text-sm text-green-600 font-medium">Reward: ₦{survey.reward}</p>
              <button
                onClick={() => alert('Redirect to survey provider')}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
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
