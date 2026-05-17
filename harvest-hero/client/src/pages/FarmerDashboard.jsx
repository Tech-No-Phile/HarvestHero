import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';

const FarmerDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [stats, setStats] = useState({
        totalHarvests: 0,
        soldHarvests: 0,
        totalRevenue: 0
    });

    const isActive = (path) => location.pathname === path;
    const showHarvests = location.pathname === '/farmer/harvests';

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
                                <Link
                                    to="/farmer"
                                    className={`px-4 py-2 rounded-lg transition-colors ${isActive('/farmer')
                                            ? 'bg-primary-500 text-white'
                                            : 'text-dark-600 hover:text-white'
                                        }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/farmer/harvests"
                                    className={`px-4 py-2 rounded-lg transition-colors ${isActive('/farmer/harvests')
                                            ? 'bg-primary-500 text-white'
                                            : 'text-dark-600 hover:text-white'
                                        }`}
                                >
                                    My Harvests
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-dark-600">Welcome back,</p>
                                <p className="text-white font-semibold">{user?.username}</p>
                            </div>
                            <button
                                onClick={logout}
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
                <Routes>
                    <Route index element={<FarmerHome stats={stats} setStats={setStats} />} />
                    <Route path="harvests" element={<MyHarvests />} />
                </Routes>
            </div>
        </div>
    );
};

const FarmerHome = ({ stats, setStats }) => {
    const [harvests, setHarvests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHarvests();
    }, []);

    const fetchHarvests = async () => {
        try {
            const response = await api.get('/harvests/my');
            const myHarvests = response.data.data;
            setHarvests(myHarvests);

            // Calculate stats
            const sold = myHarvests.filter(h => h.status === 'sold');
            const revenue = sold.reduce((sum, h) => sum + h.price, 0);

            setStats({
                totalHarvests: myHarvests.length,
                soldHarvests: sold.length,
                totalRevenue: revenue
            });
        } catch (error) {
            console.error('Error fetching harvests:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-xl"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-dark-600 text-sm">Total Harvests</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalHarvests}</p>
                        </div>
                        <div className="text-4xl">🌾</div>
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
                            <p className="text-dark-600 text-sm">Sold Harvests</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.soldHarvests}</p>
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
                            <p className="text-dark-600 text-sm">Total Revenue</p>
                            <p className="text-3xl font-bold text-primary-500 mt-2">
                                ₹{stats.totalRevenue.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-4xl">💰</div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Harvests */}
            <div className="glass p-6 rounded-xl">
                <h2 className="text-xl font-bold text-white mb-4">Recent Harvests</h2>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    </div>
                ) : harvests.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-dark-600 mb-4">You haven't created any harvests yet</p>
                        <Link
                            to="/farmer/harvests"
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                            Create Your First Harvest
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {harvests.slice(0, 5).map((harvest) => (
                            <div
                                key={harvest._id}
                                className="flex items-center justify-between p-4 bg-dark-100 rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-semibold">{harvest.cropName}</p>
                                    <p className="text-dark-600 text-sm">
                                        {harvest.quantity} units • ₹{harvest.price}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${harvest.status === 'sold'
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-blue-500/20 text-blue-500'
                                            }`}
                                    >
                                        {harvest.status}
                                    </span>
                                    {harvest.blockchainTxHash && harvest.blockchainTxHash !== 'blockchain_error' && (
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

const MyHarvests = () => {
    const [harvests, setHarvests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        cropName: '',
        quantity: '',
        price: ''
    });

    useEffect(() => {
        fetchHarvests();
    }, []);

    const fetchHarvests = async () => {
        try {
            const response = await api.get('/harvests/my');
            setHarvests(response.data.data);
        } catch (error) {
            console.error('Error fetching harvests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/harvests', formData);
            setFormData({ cropName: '', quantity: '', price: '' });
            setShowCreateForm(false);
            fetchHarvests();
        } catch (error) {
            console.error('Error creating harvest:', error);
            alert('Failed to create harvest');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this harvest?')) return;

        try {
            await api.delete(`/harvests/${id}`);
            fetchHarvests();
        } catch (error) {
            console.error('Error deleting harvest:', error);
            alert('Failed to delete harvest');
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
                <h2 className="text-2xl font-bold text-white">My Harvests</h2>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                    {showCreateForm ? 'Cancel' : '+ Create Harvest'}
                </button>
            </div>

            {showCreateForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass p-6 rounded-xl"
                >
                    <h3 className="text-xl font-bold text-white mb-4">Create New Harvest</h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">
                                Crop Name
                            </label>
                            <input
                                type="text"
                                value={formData.cropName}
                                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                placeholder="e.g., Wheat, Rice, Corn"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Quantity (Tons/KG)
                                </label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                    placeholder="1000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark-700 mb-2">
                                    Price (₹/Ton or ₹/KG)
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 bg-dark-100 border border-dark-200 rounded-lg text-white focus:outline-none focus:border-primary-500"
                                    placeholder="5000"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                            Create Harvest
                        </button>
                    </form>
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {harvests.map((harvest) => (
                    <motion.div
                        key={harvest._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-6 rounded-xl"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-white">{harvest.cropName}</h3>
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${harvest.status === 'sold'
                                        ? 'bg-green-500/20 text-green-500'
                                        : 'bg-blue-500/20 text-blue-500'
                                    }`}
                            >
                                {harvest.status}
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <p className="text-dark-600">
                                <span className="text-white font-semibold">Quantity:</span> {harvest.quantity} units
                            </p>
                            <p className="text-dark-600">
                                <span className="text-white font-semibold">Price:</span> ₹{harvest.price}
                            </p>
                            {harvest.buyerId && (
                                <p className="text-dark-600">
                                    <span className="text-white font-semibold">Buyer:</span> {harvest.buyerId.username}
                                </p>
                            )}
                        </div>

                        {harvest.blockchainTxHash && harvest.blockchainTxHash !== 'blockchain_error' && (
                            <div className="mb-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
                                <p className="text-primary-500 text-sm font-semibold mb-1">⛓️ Blockchain Verified</p>
                                <p className="text-dark-600 text-xs font-mono truncate">
                                    {harvest.blockchainTxHash}
                                </p>
                            </div>
                        )}

                        {harvest.status === 'available' && (
                            <button
                                onClick={() => handleDelete(harvest._id)}
                                className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>

            {harvests.length === 0 && (
                <div className="text-center py-12 glass rounded-xl">
                    <div className="text-6xl mb-4">🌾</div>
                    <p className="text-dark-600 text-lg">No harvests yet. Create your first one!</p>
                </div>
            )}
        </div>
    );
};

export default FarmerDashboard;