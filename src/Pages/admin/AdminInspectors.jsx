import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/axios'; // adjust your path

export default function AdminInspectors() {
  const [inspectors, setInspectors] = useState([]);

  useEffect(() => {
    async function fetchInspectors() {
      try {
        const res = await api.get('/admin/inspectors');
        setInspectors(res.data);
      } catch (err) {
        console.error('Failed to fetch inspectors:', err);
        // Fallback dummy
        setInspectors([
          { id: 1, name: 'Inspector Joe', email: 'joe@example.com', status: 'active' },
          { id: 2, name: 'Inspector Mary', email: 'mary@example.com', status: 'suspended' },
        ]);
      }
    }

    fetchInspectors();
  }, []);

  async function toggleStatus(inspectorId, currentStatus) {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await api.post(`/admin/inspectors/${inspectorId}/status`, { status: newStatus });
      setInspectors((prev) =>
        prev.map((insp) =>
          insp.id === inspectorId ? { ...insp, status: newStatus } : insp
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update status.');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🕵️ Inspectors</h2>
        <Link
          to="/admin/inspectors/add"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Add Inspector
        </Link>
      </div>

      <table className="min-w-full bg-white shadow rounded overflow-x-auto">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inspectors.map((inspector, index) => (
            <tr key={inspector.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{inspector.name}</td>
              <td className="px-4 py-2">{inspector.email}</td>
              <td className="px-4 py-2 capitalize">{inspector.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => toggleStatus(inspector.id, inspector.status)}
                  className={`px-3 py-1 rounded text-xs ${
                    inspector.status === 'active'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {inspector.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
          {inspectors.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                No inspectors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
