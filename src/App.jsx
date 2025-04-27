import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import { SessionProvider } from './context/SessionContext';
import './App.css';

function App() {
  return (
    <SessionProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collection/:collectionId" element={<CollectionDetailPage />} />
              <Route path="/collection/:collectionSlug/product/:productSlug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SessionProvider>
  );
}

export default App;
