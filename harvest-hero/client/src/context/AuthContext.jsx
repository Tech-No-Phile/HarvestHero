import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';
const AuthContext = createContext();
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);
    const login = async (email, password) => {
        try {
            console.log('Attempting login to:', '/auth/login');
            console.log('Email:', email);
            const response = await api.post('/auth/login', { email, password });
            console.log('Login response:', response.data);
            const { token, ...userData } = response.data.data;
            const userToSave = {
                ...userData,
                _id: userData._id || userData.id
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userToSave));
            setUser(userToSave);
            return userToSave;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    };
    const register = async (username, email, password, role) => {
        try {
            console.log('Attempting registration to:', '/auth/register');
            console.log('Data:', { username, email, role });
            const response = await api.post('/auth/register', { username, email, password, role });
            console.log('Registration response:', response.data);
            const { token, ...userData } = response.data.data;
            const userToSave = {
                ...userData,
                _id: userData._id || userData.id
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userToSave));
            setUser(userToSave);
            return userToSave;
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
