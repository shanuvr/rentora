import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/customer/BottomNavigation';
import LanguageModal from '../components/common/LanguageModal';

export default function CustomerLayout() {
  const [cartCount, setCartCount] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en');
  const [showLangModal, setShowLangModal] = useState(false);
  const [canCloseLangModal, setCanCloseLangModal] = useState(true);

  // Sync cart count from localStorage
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

    // Check language preference in localStorage
    const savedLang = localStorage.getItem('rentora_lang');
    if (!savedLang) {
      // First visit: automatically open language modal
      setCanCloseLangModal(false);
      setShowLangModal(true);
    } else {
      setSelectedLang(savedLang);
      setCanCloseLangModal(true);
    }

    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('rentora_cart_updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);
    return () => {
      window.removeEventListener('rentora_cart_updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const handleSelectLang = (lang) => {
    setSelectedLang(lang);
    localStorage.setItem('rentora_lang', lang);
    setCanCloseLangModal(true);
  };

  const openLanguageModal = () => {
    setCanCloseLangModal(true);
    setShowLangModal(true);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-20">
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        <Outlet
          context={{
            cartCount,
            updateCartCount,
            selectedLang,
            openLanguageModal,
          }}
        />
      </main>

      <BottomNavigation cartCount={cartCount} />

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        currentLang={selectedLang}
        onSelectLang={handleSelectLang}
        canClose={canCloseLangModal}
      />
    </div>
  );
}
