import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import VendorDashboard from './pages/VendorDashboard';
import LandownerDashboard from './pages/LandownerDashboard';
//import Unauthorized from './pages/Unauthorized';
import './index.css';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'farmer') return <Navigate to="/farmer" />;
  if (user.role === 'vendor') return <Navigate to="/vendor" />;
  if (user.role === 'landowner') return <Navigate to="/landowner" />;
  return <Navigate to="/login" />;
};
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
          <Route path="/farmer/*" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          {/* <Route path="/farmer/harvests" element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          } /> */}
          {/* Vendor Routes redirecting */}
          <Route path="/vendor/*" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />
          {/* <Route path="/vendor/marketplace" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } /> */}
          {/* Landowner Routes redirecting */}
          <Route path="/landowner/*" element={
            <ProtectedRoute allowedRoles={['landowner']}>
              <LandownerDashboard />
            </ProtectedRoute>
          } />
          {/* <Route path="/landowner/lands" element={
            <ProtectedRoute allowedRoles={['landowner']}>
              <LandownerDashboard />
            </ProtectedRoute>
          } /> */}
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center bg-dark-50"><h1 className="text-2xl font-bold text-white">Unauthorized Access</h1></div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

