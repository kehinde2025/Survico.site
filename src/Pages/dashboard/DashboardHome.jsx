// src/pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";
import api from "../../utils/axios";

export default function DashboardHome() {
  const [user, setUser] = useState({
    name: "",
    earnings: 0,
    tasksCompleted: 0,
    referrals: 0,
    points: 0,
  });
  const [topSurveys, setTopSurveys] = useState([]);
  const [topOffers, setTopOffers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // ✅ Fetch user, surveys, offers
      const [userRes, surveysRes, offersRes] = await Promise.all([
        api.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/api/surveys/top").catch(() => ({ data: [] })),
        api.get("/api/offerwall/top").catch(() => ({ data: [] })), // ✅ correct endpoint
      ]);

      setUser({
        name: userRes.data?.name || "User",
        earnings: userRes.data?.balance || 0,
        tasksCompleted: userRes.data?.tasksCompleted || 0,
        referrals: userRes.data?.referrals || 0,
        points: userRes.data?.points || 0,
      });

      setTopSurveys(surveysRes.data || []);
      setTopOffers(offersRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setApiError("Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications separately
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Notifications fetch error:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const dollarsFromPoints = (user.points / 100).toFixed(2);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-16">
      {/* Error Banner */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>
            <p className="text-red-500 text-sm">{apiError}</p>
            <button
              onClick={fetchDashboardData}
              className="text-red-500 hover:text-red-400 text-xs underline flex items-center mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-gray-400">Let’s earn more today!</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-white relative p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-72 bg-[#140932] border border-gray-700 rounded-lg shadow-lg z-10">
              {notifications.length === 0 ? (
                <p className="p-3 text-gray-500">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 text-sm text-white border-b border-gray-700"
                  >
                    {n.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Earnings" value={`$${user.earnings.toFixed(2)}`} color="blue" />
        <StatCard label="Tasks Completed" value={user.tasksCompleted} color="green" />
        <StatCard
          label="Points"
          value={`${user.points} pts`}
          color="yellow"
          sub={`(~$${dollarsFromPoints})`}
        />
        <StatCard
          label="Referrals"
          value={user.referrals}
          color="purple"
          link={{ to: "/dashboard/referral", text: "View referral details →" }}
        />
      </div>

      {/* Top Surveys */}
      <Section title="🔥 Top Surveys">
        {topSurveys.length > 0 ? (
          topSurveys.map((s) => (
            <ItemCard
              key={s.id}
              title={s.title}
              reward={`$${s.reward}`}
              link={`/dashboard/survey/${s.id}`}
              linkText="Start Survey →"
              color="blue"
            />
          ))
        ) : (
          <EmptyState text="No surveys available" />
        )}
      </Section>

      {/* Top Offers */}
      <Section title="💎 Top Offers">
        {topOffers.length > 0 ? (
          topOffers.map((o) => (
            <ItemCard
              key={o.id}
              title={o.title}
              reward={`$${o.reward}`}
              link={`/dashboard/offers/${o.id}`}
              linkText="View Offer →"
              color="green"
            />
          ))
        ) : (
          <EmptyState text="No offers available" />
        )}
      </Section>
    </div>
  );
}

/* ---------- Reusable UI Components ---------- */

function StatCard({ label, value, color, sub, link }) {
  const colors = {
    blue: "border-blue-500 text-blue-700",
    green: "border-green-500 text-green-700",
    yellow: "border-yellow-500 text-yellow-600",
    purple: "border-purple-500 text-purple-700",
  };

  return (
    <div className={`bg-white rounded-lg shadow p-4 text-center border-t-4 ${colors[color]}`}>
      <h2 className="text-sm text-gray-500">{label}</h2>
      <p className="text-xl font-bold">{value}</p>
      {sub && <p className="text-sm text-gray-600">{sub}</p>}
      {link && (
        <Link to={link.to} className="text-sm text-blue-600 hover:underline mt-1 block">
          {link.text}
        </Link>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-white">{title}</h3>
      {children}
    </div>
  );
}

function ItemCard({ title, reward, link, linkText, color }) {
  const rewardColors = {
    blue: "text-blue-600",
    green: "text-green-600",
  };

  return (
    <div className="bg-white border rounded-lg p-3 shadow">
      <h4 className="font-semibold text-sm mb-1">{title}</h4>
      <p className={`${rewardColors[color]} text-sm font-bold`}>{reward}</p>
      <Link to={link} className={`text-sm ${rewardColors[color]} hover:underline`}>
        {linkText}
      </Link>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4 text-center">
      <p className="text-gray-400">{text}</p>
    </div>
  );
}
