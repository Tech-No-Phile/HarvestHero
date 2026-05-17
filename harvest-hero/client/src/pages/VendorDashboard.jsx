import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import api from '../utils/api';

const VendorDashboard = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path;
    const showMarketplace = location.pathname === '/vendor/marketplace';

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
                                    onClick={() => navigate('/vendor')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${isActive('/vendor')
                                            ? 'bg-primary-500 text-white'
                                            : 'text-dark-600 hover:text-white'
                                        }`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/vendor/marketplace')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${isActive('/vendor/marketplace')
                                            ? 'bg-primary-500 text-white'
                                            : 'text-dark-600 hover:text-white'
                                        }`}
                                >
                                    Marketplace
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
                {showMarketplace ? <Marketplace /> : <VendorHome />}
            </div>
        </div>
    );
};

const VendorHome = () => {
    const [stats, setStats] = useState({
        totalPurchases: 0,
        totalSpent: 0,
        availableHarvests: 0
    });
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();

        // Auto-refresh to catch new purchases
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            console.log('Current user:', user);
            const allHarvestsRes = await api.get('/harvests');
            const allHarvests = allHarvestsRes.data.data;
            console.log('All harvests:', allHarvests);
            const available = allHarvests.filter(h => h.status === 'available');
            const userId = user._id || user.id;
            // Filter purchases - harvests where buyerId matches current user
            const myPurchases = allHarvests.filter(h => {
                const isSold = h.status === 'sold';
                const isBuyer = h.buyerId && (h.buyerId._id === userId || h.buyerId.id === userId);

                console.log(`Harvest ${h.cropName}: sold=${isSold}, buyerId=${h.buyerId?._id || h.buyerId?.id}, match=${isBuyer}`);

                return isSold && isBuyer;
            });

            console.log('My purchases:', myPurchases);

            const totalSpent = myPurchases.reduce((sum, h) => sum + h.price, 0);

            setStats({
                totalPurchases: myPurchases.length,
                totalSpent: totalSpent,
                availableHarvests: available.length
            });

            setPurchases(myPurchases);
        } catch (error) {
            console.error('Error fetching data:', error);
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
                            <p className="text-dark-600 text-sm">Total Purchases</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.totalPurchases}</p>
                        </div>
                        <div className="text-4xl">🛒</div>
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
                            <p className="text-dark-600 text-sm">Total Spent</p>
                            <p className="text-3xl font-bold text-primary-500 mt-2">
                                ₹{stats.totalSpent.toLocaleString()}
                            </p>
                        </div>
                        <div className="text-4xl">💰</div>
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
                            <p className="text-dark-600 text-sm">Available Harvests</p>
                            <p className="text-3xl font-bold text-white mt-2">{stats.availableHarvests}</p>
                        </div>
                        <div className="text-4xl">🌾</div>
                    </div>
                </motion.div>
            </div>

            {/* Recent Purchases */}
            <div className="glass p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Recent Purchases</h2>
                    <button
                        onClick={() => navigate('/vendor/marketplace')}
                        className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                    >
                        Browse Marketplace
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    </div>
                ) : purchases.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-dark-600 mb-4">You haven't purchased any harvests yet</p>
                        <button
                            onClick={() => navigate('/vendor/marketplace')}
                            className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                            Explore Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {purchases.slice(0, 5).map((purchase) => (
                            <div
                                key={purchase._id}
                                className="flex items-center justify-between p-4 bg-dark-100 rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-semibold">{purchase.cropName}</p>
                                    <p className="text-dark-600 text-sm">
                                        From: {purchase.farmerId?.username || 'Unknown'} • {purchase.quantity} units
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-primary-500 font-bold">₹{purchase.price}</p>
                                    {purchase.blockchainTxHash && purchase.blockchainTxHash !== 'blockchain_error' && (
                                        <span className="text-primary-500 text-sm">⛓️ Verified</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Debug Info (remove after testing) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="glass p-4 rounded-xl">
                    <p className="text-xs text-dark-600">Debug: {purchases.length} purchases found</p>
                </div>
            )}
        </div>
    );
};

const Marketplace = () => {
    const [harvests, setHarvests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHarvests();
    }, []);

    const fetchHarvests = async () => {
        try {
            const response = await api.get('/harvests');
            const available = response.data.data.filter(h => h.status === 'available');
            setHarvests(available);
        } catch (error) {
            console.error('Error fetching harvests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (harvestId) => {
        if (!confirm('Are you sure you want to purchase this harvest?')) return;

        setPurchasing(harvestId);
        try {
            const response = await api.put(`/harvests/${harvestId}/purchase`);

            console.log('Purchase response:', response.data);

            const blockchainMsg = response.data.blockchain?.recorded
                ? '\n\n🔗 Transaction recorded on blockchain!'
                : '\n\n⚠️ Note: Blockchain recording failed';

            alert('✅ Purchase Successful!' + blockchainMsg);

            // Refresh marketplace
            await fetchHarvests();

            // Optionally navigate to dashboard to see purchase
            setTimeout(() => {
                navigate('/vendor');
            }, 1000);

        } catch (error) {
            console.error('Error purchasing harvest:', error);
            alert('❌ Failed to purchase: ' + (error.response?.data?.message || 'Unknown error'));
        } finally {
            setPurchasing(null);
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
            <div>
                <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                <p className="text-dark-600 mt-1">Browse and purchase harvests from farmers</p>
            </div>

            {harvests.length === 0 ? (
                <div className="text-center py-12 glass rounded-xl">
                    <div className="text-6xl mb-4">🌾</div>
                    <p className="text-dark-600 text-lg">No harvests available at the moment</p>
                    <p className="text-dark-600 text-sm mt-2">Check back later for new listings!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {harvests.map((harvest) => (
                        <motion.div
                            key={harvest._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass p-6 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{harvest.cropName}</h3>
                                    <p className="text-dark-600 text-sm mt-1">
                                        by {harvest.farmerId?.username || 'Unknown'}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                                    Available
                                </span>
                            </div>

                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <p className="text-dark-600">Quantity</p>
                                    <p className="text-white font-semibold">{harvest.quantity} units</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-dark-600">Price</p>
                                    <p className="text-primary-500 font-bold text-xl">${harvest.price}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-dark-600">Per Unit</p>
                                    <p className="text-white">${(harvest.price / harvest.quantity).toFixed(2)}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handlePurchase(harvest._id)}
                                disabled={purchasing === harvest._id}
                                className="w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {purchasing === harvest._id ? 'Processing...' : 'Purchase Now'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorDashboard;
