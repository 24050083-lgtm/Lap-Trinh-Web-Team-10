import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderTracking from './pages/OrderTracking';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProduct from './pages/AdminProduct';
import AdminOrders from './pages/AdminOrders';
import AdminCustomer from './pages/AdminCustomer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff', color: '#333', borderRadius: '20px', padding: '16px 24px', fontWeight: 'bold'
            },
          }}
        />
        <Router> 
          <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

                {/* Admin Management Routes */}
                <Route path="/admin" element={<ProtectedRoute requiredRole={1}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/products" element={<ProtectedRoute requiredRole={1}><AdminProduct /></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute requiredRole={1}><AdminOrders /></ProtectedRoute>} />
                <Route path="/admin/customers" element={<ProtectedRoute requiredRole={1}><AdminCustomer /></ProtectedRoute>} />

                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;