// src/Pages/inspector/InspectorLayout.jsx
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function InspectorLayout() {
  const navigate = useNavigate();

  const inspector = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    if (inspector.role !== 'inspector') {
      navigate('/login');
    }
  }, [inspector.role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#140932] text-white flex flex-col">
        <div className="p-6 border-b border-[#1f1445]">
          <div className="text-2xl font-bold mb-2">Survico Inspector</div>
          <div className="text-sm text-gray-300">{inspector.name || 'Inspector'}</div>
          <div className="text-xs text-gray-400">{inspector.email || ''}</div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link
            to="/inspector/dashboard"
            className="block px-3 py-2 rounded hover:bg-[#1e1145]"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/inspector/chat"
            className="block px-3 py-2 rounded hover:bg-[#1e1145]"
          >
            💬 Chat with Users
          </Link>

          <Link
            to="/inspector/tasks"
            className="block px-3 py-2 rounded hover:bg-[#1e1145]"
          >
            ✅ Review Tasks
          </Link>

          <Link
            to="/inspector/profile"
            className="block px-3 py-2 rounded hover:bg-[#1e1145]"
          >
            ⚙️ Profile Settings
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
