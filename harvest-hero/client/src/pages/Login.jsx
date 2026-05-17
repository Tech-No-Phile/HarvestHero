import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const user = await login(email,password);
            if (user.role === 'farmer') {
                navigate('/farmer');
            } else if (user.role === 'vendor') {
                navigate('/vendor');
            } else if (user.role === 'landowner') {
                navigate('/landowner');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50 flex itemms-center justify-center px-4'>
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className='w-full max-w-md'
            >
                <div className='glass p-8 rounded-2xl'>
                    <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
                    <p className='text-dark-600 mb-8'>Sign in to your account</p>
                    {error && (<div className='bg-red-500/10 border border-500/50 text-red-500 px-4 py-3 rounded-lg mb-6'>{error}</div>)}
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label className='block text-sm font-medium text-dark-700 mb-2'>Email</label>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className='w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:border-primary-500 transition-colors' placeholder='you@example.com'/>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-dark-700 mb-2'>Password</label>
                            <input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className='w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:border-primary-500 transition-colors' placeholder='********'/>
                        </div>
                        <button type='submit' disabled={loading} className='w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                    <p className='text-sm text-dark-600 mt-6 text-center'>
                        Don't have an account? <Link to='/register' className='text-primary-500 hover:text-primary-400 font-semibold'>Sign up</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
export default Login;