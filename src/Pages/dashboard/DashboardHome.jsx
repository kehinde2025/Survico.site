import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../utils/axios';

export default function DashboardHome() {
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: 'Loading...',
      earnings: 0,
      tasksCompleted: 0,
      referrals: 0,
      points: 0
    },
    topSurveys: [],
    topOffers: []
  });

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const token = localStorage.getItem('token');

      const [userRes, surveysRes, offersRes] = await Promise.all([
        api.get('/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).catch(() => ({ data: {} })),

        api.get('/api/surveys/top').catch(() => ({ data: [] })),
        api.get('/api/offers/top').catch(() => ({ data: [] }))
      ]);

      setDashboardData({
        user: {
          name: userRes.data?.name || '',
          earnings: userRes.data?.balance || 0,
          tasksCompleted: userRes.data?.tasksCompleted || 0,
          referrals: userRes.data?.referrals || 0,
          points: userRes.data?.points || 0
        },
        topSurveys: surveysRes.data || [],
        topOffers: offersRes.data || []
      });

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setApiError('Data might not be up to date');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => console.error('Notifications error:', err));
  }, []);

  const handleRetry = () => {
    fetchData();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const { user, topSurveys, topOffers } = dashboardData;
  const dollarsFromPoints = (user.points / 100).toFixed(2);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-16">
      {/* Error Banner */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-500 text-sm">{apiError}</p>
            <button
              onClick={handleRetry}
              className="text-red-500 hover:text-red-400 text-xs underline flex items-center mt-1"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Refresh data
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
          <p className="text-gray-400">Let's earn more today!</p>
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
                notifications.map(n => (
                  <div key={n.id} className="p-3 text-sm text-white border-b border-gray-700">
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
        <div className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-blue-500">
          <h2 className="text-sm text-gray-500">Earnings</h2>
          <p className="text-xl font-bold text-blue-700">
            ${user.earnings.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-green-500">
          <h2 className="text-sm text-gray-500">Tasks Completed</h2>
          <p className="text-xl font-bold text-green-700">
            {user.tasksCompleted}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-yellow-500">
          <h2 className="text-sm text-gray-500">Points</h2>
          <p className="text-xl font-bold text-yellow-600">
            {user.points} pts
          </p>
          <p className="text-sm text-gray-600">(~${dollarsFromPoints})</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center border-t-4 border-purple-500">
          <h2 className="text-sm text-gray-500">Referrals</h2>
          <p className="text-xl font-bold text-purple-700">
            {user.referrals}
          </p>
          <Link
            to="/dashboard/referral"
            className="text-sm text-purple-600 hover:underline mt-1 block"
          >
            View referral details →
          </Link>
        </div>
      </div>

      {/* Top Surveys */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">🔥 Top Surveys</h3>
        {topSurveys.length > 0 ? (
          topSurveys.map(survey => (
            <div key={survey.id} className="bg-white border rounded-lg p-3 shadow">
              <h4 className="font-semibold text-sm mb-1">{survey.title}</h4>
              <p className="text-blue-600 text-sm font-bold">
                ${survey.reward}
              </p>
              <Link
                to={`/dashboard/survey/${survey.id}`}
                className="text-sm text-blue-500 hover:underline"
              >
                Start Survey →
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-400">No surveys available</p>
          </div>
        )}
      </div>

      {/* Top Offers */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">💎 Top Offers</h3>
        {topOffers.length > 0 ? (
          topOffers.map(offer => (
            <div key={offer.id} className="bg-white border rounded-lg p-3 shadow">
              <h4 className="font-semibold text-sm mb-1">{offer.title}</h4>
              <p className="text-green-600 text-sm font-bold">
                ${offer.reward}
              </p>
              <Link
                to={`/dashboard/offers/${offer.id}`}
                className="text-sm text-green-500 hover:underline"
              >
                View Offer →
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-gray-800/20 border border-gray-700 rounded-lg p-4 text-center">
            <p className="text-gray-400">No offers available</p>
          </div>
        )}
      </div>
    </div>
  );
}
