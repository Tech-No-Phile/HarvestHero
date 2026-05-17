import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const Landing = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from dark-50 via-dark-100 to dark-50">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <h1 className="text-6xl font-bold text-white mb-6">
                        Harvest<span className='text-primary-500'> Hero</span>
                    </h1>
                    <p className="text-xl text-dark-600 mb-12 max-w-2xl mx-auto">
                        Blockchain-powered agricultural marketplace connecting farmers, vendors, and landowners.
                    </p>
                    <div className="flex gap-6 justify-center flex-wrap">
                        <Link to="/register" className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:bg-primary-600">
                            Get Started
                        </Link>
                        <Link to="/login" className="px-8 py-4 glass glass-hover text-white rounded-lg font-semibold">
                        Sign In
                        </Link>
                    </div>
                </motion.div>
                {/* Features Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="grid md:grid-cols-3 gap-8 mt-20"
                >
                    <div className="glass p-8 rounded-xl">
                        <div className='text-primary-500 text-4xl mb-4'>🌾</div>
                        <h3 className="text-xl font-semibold text-white mb-3">For Farmers</h3>
                        <p className="text-dark-600">
                            List your harvests and connect directly with vendors. Track all transactions securely on the blockchain.
                        </p>
                    </div>
                    <div className="glass p-8 rounded-xl">
                        <div className='text-primary-500 text-4xl mb-4'>🛒</div>
                        <h3 className="text-xl font-semibold text-white mb-3">For Vendors</h3>
                        <p className="text-dark-600">
                            Purchase quality produce directly from farmers with transparent pricing and blockchain-verified transactions.
                        </p>
                    </div>
                    <div className="glass p-8 rounded-xl">
                        <div className='text-primary-500 text-4xl mb-4'>🏠</div>
                        <h3 className="text-xl font-semibold text-white mb-3">For Landowners</h3>
                        <p className="text-dark-600">
                            Lease out your agricultural land and connect with farmers looking for suitable plots wherein, The records of agreements are stored on the blockchain.
                        </p>
                    </div>
                </motion.div>
            </div>
            </div>
    );
};
export default Landing;