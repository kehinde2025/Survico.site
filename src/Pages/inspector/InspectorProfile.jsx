// src/Pages/inspector/InspectorProfile.jsx
import { useState } from 'react';

export default function InspectorProfile() {
  // Dummy inspector profile info
  const [inspector, setInspector] = useState({
    name: 'Inspector Joe',
    email: 'inspector@gmail.com',
    status: 'Active',
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">👤 Inspector Profile</h2>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <div>
          <label className="block text-sm text-gray-500">Name</label>
          <p className="text-lg font-medium">{inspector.name}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500">Email</label>
          <p className="text-lg font-medium">{inspector.email}</p>
        </div>

        <div>
          <label className="block text-sm text-gray-500">Status</label>
          <p className={`text-lg font-medium ${inspector.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
            {inspector.status}
          </p>
        </div>
      </div>
    </div>
  );
}
