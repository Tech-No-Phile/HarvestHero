import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';

const LandownerDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const showLands = location.pathname === '/landowner/lands';

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Navbar */}
      <nav className="glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-white">
                Harvest<span className="text-primary-500">Hero</span>
              </h1>
              
              <div className="hidden md:flex gap-4">
                <button
                  onClick={() => navigate('/landowner')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive('/landowner')
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-600 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/landowner/lands')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive('/landowner/lands')
                      ? 'bg-primary-500 text-white'
                      : 'text-dark-600 hover:text-white'
                  }`}
                >
                  My Lands
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-dark-600">Welcome back,</p>
                <p className="text-white font-semibold">{user?.username}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLands ? <MyLands /> : <LandownerHome />}
      </div>
    </div>
  );
};

const LandownerHome = () => {
  const [stats, setStats] = useState({
    totalLands: 0,
    leasedLands: 0,
    pendingRequests: 0,
    totalIncome: 0
  });
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/lands/my');
      const myLands = response.data.data;
      
      const leased = myLands.filter(l => l.status === 'leased');
      const pending = myLands.filter(l => l.status === 'pending');
      const totalIncome = leased.reduce((sum, l) => sum + l.leasePrice, 0);

      setStats({
        totalLands: myLands.length,
        leasedLands: leased.length,
        pendingRequests: pending.length,
        totalIncome: totalIncome
      });

      setLands(myLands);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Lands</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalLands}</p>
            </div>
            <div className="text-4xl">🏞️</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Leased Lands</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.leasedLands}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.pendingRequests}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-600 text-sm">Total Income</p>
              <p className="text-3xl font-bold text-primary-500 mt-2">
                ${stats.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </motion.div>
      </div>

      {/* Recent Lands */}
      <div className="glass p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recent Lands</h2>
          <button
            onClick={() => navigate('/landowner/lands')}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Manage Lands
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          </div>
        ) : lands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-600 mb-4">You haven't listed any lands yet</p>
            <button
              onClick={() => navigate('/landowner/lands')}
              className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              List Your First Land
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {lands.slice(0, 5).map((land) => (
              <div
                key={land._id}
                className="flex items-center justify-between p-4 bg-dark-100 rounded-lg"
              >
                <div>
                  <p className="text-white font-semibold">{land.location}</p>
                  <p className="text-dark-600 text-sm">
                    {land.size} acres • ${land.leasePrice}
                    {land.leasedTo && ` • Leased to ${land.leasedTo.username}`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      land.status === 'leased'
                        ? 'bg-green-500/20 text-green-500'
                        : land.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-blue-500/20 text-blue-500'
                    }`}
                  >
                    {land.status}
                  </span>
                  {land.blockchainTxHash && land.blockchainTxHash !== 'blockchain_error' && (
                    <span className="text-primary-500 text-sm">⛓️ On-chain</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MyLands = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [approving, setApproving] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    size: '',
    leasePrice: ''
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await api.get('/lands/my');
      setLands(response.data.data);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await api.post('/lands', formData);
      setFormData({ location: '', size: '', leasePrice: '' });
      setShowCreateForm(false);
      fetchLands();
    } catch (error) {
      console.error('Error creating land:', error);
      alert('Failed to create land: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  const handleApproveLease = async (landId) => {
    if (!confirm('Are you sure you want to approve this lease request?')) return;
    
    setApproving(landId);
    try {
      const response = await api.put(`/lands/${landId}/approve`);
      
      if (response.data.blockchain?.recorded) {
        alert('✅ Lease approved!\n\n🔗 Transaction recorded on blockchain:\n' + response.data.blockchain.txHash.slice(0, 20) + '...');
      } else {
        alert('✅ Lease approved!\n\n⚠️ Blockchain recording failed, but lease is saved.');
      }
      
      fetchLands();
    } catch (error) {
      console.error('Error approving lease:', error);
      alert('❌ Failed to approve lease: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setApproving(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this land listing?')) return;
    
    try {
      await api.delete(`/lands/${id}`);
      fetchLands();
    } catch (error) {
      console.error('Error deleting land:', error);
      alert('Failed to delete land: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Lands</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          {showCreateForm ? 'Cancel' : '+ List Land'}
        </button>
      </div>

      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass p-6 rounded-xl"
        >
          <h3 className="text-xl font-bold text-white mb-4">List New Land</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                placeholder="e.g., Green Valley, California"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Size (acres)
                </label>
                <input
                  type="number"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  required
                  min="0.1"
                  step="0.1"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Lease Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.leasePrice}
                  onChange={(e) => setFormData({ ...formData, leasePrice: e.target.value })}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  placeholder="10000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {creating ? 'Listing...' : 'List Land'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lands.map((land) => (
          <motion.div
            key={land._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{land.location}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  land.status === 'leased'
                    ? 'bg-green-500/20 text-green-500'
                    : land.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-blue-500/20 text-blue-500'
                }`}
              >
                {land.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-dark-600">
                <span className="text-white font-semibold">Size:</span> {land.size} acres
              </p>
              <p className="text-dark-600">
                <span className="text-white font-semibold">Price:</span> ₹{land.leasePrice}
              </p>
              {land.leasedTo && (
                <p className="text-dark-600">
                  <span className="text-white font-semibold">Farmer:</span> {land.leasedTo.username}
                </p>
              )}
            </div>

            {land.blockchainTxHash && land.blockchainTxHash !== 'blockchain_error' && (
              <div className="mb-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
                <p className="text-primary-500 text-sm font-semibold mb-1">⛓️ Blockchain Verified</p>
                <p className="text-dark-600 text-xs font-mono truncate">
                  {land.blockchainTxHash}
                </p>
              </div>
            )}

            {land.status === 'pending' && (
              <button
                onClick={() => handleApproveLease(land._id)}
                disabled={approving === land._id}
                className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors mb-2 disabled:opacity-50"
              >
                {approving === land._id ? 'Approving...' : 'Approve Lease'}
              </button>
            )}

            {land.status === 'available' && (
              <button
                onClick={() => handleDelete(land._id)}
                className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {lands.length === 0 && (
        <div className="text-center py-12 glass rounded-xl">
          <div className="text-6xl mb-4">🏞️</div>
          <p className="text-dark-600 text-lg">No lands listed yet. Create your first listing!</p>
        </div>
      )}
    </div>
  );
};

export default LandownerDashboard;
