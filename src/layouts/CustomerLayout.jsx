import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/customer/BottomNavigation';

export default function CustomerLayout() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const stored = localStorage.getItem('rentora_cart');
      if (stored) {
        const items = JSON.parse(stored);
        setCartCount(Array.isArray(items) ? items.length : 0);
      } else {
        setCartCount(0);
      }
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('rentora_cart_updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('rentora_cart_updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-20">
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        <Outlet context={{ cartCount, updateCartCount }} />
      </main>
      <BottomNavigation cartCount={cartCount} />
    </div>
  );
}
