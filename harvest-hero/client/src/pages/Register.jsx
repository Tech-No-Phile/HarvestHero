import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "farmer",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await register(formData.username, formData.email, formData.password, formData.role);
            if (user.role === "farmer") {
                navigate("/farmer");
            }
            else if (user.role === "vendor") {
                navigate("/vendor");
            }
            else if (user.role === "landowner") {
                navigate("/landowner");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
        finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-50 via-dark-100 to-dark-50 flex itemms-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-dark-600 mb-8">Join HarvestHero marketplace</p>
                    {error && (<div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">{error}</div>)}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:border-primary-500 transition-colors" placeholder="Your username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:border-primary-500 transition-colors" placeholder="********" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-dark-100 border border-dark-200 text-white focus:outline-none focus:ring-2 focus:border-primary-500 transition-colors"
                            >
                                <option value="farmer">Farmer</option>
                                <option value="vendor">Vendor</option>
                                <option value="landowner">Landowner</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                    <p className="text-dark-600 mt-6 text-center">
                        Already have an account?{' '} <Link to="/login" className="text-primary-500 hover:underline">Sign in</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
export default Register;