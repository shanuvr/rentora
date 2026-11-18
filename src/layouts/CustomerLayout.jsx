import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../components/customer/BottomNavigation';
import LanguageModal from '../components/common/LanguageModal';

const getStoredCartCount = () => {
  try {
    const stored = localStorage.getItem('rentora_cart');
    if (stored) {
      const items = JSON.parse(stored);
      if (Array.isArray(items)) {
        return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      }
    }
    return 0;
  } catch {
    return 0;
  }
};

const getStoredLang = () => {
  try {
    return localStorage.getItem('rentora_lang') || 'en';
  } catch {
    return 'en';
  }
};

export default function CustomerLayout() {
  const [cartCount, setCartCount] = useState(getStoredCartCount);
  const [selectedLang, setSelectedLang] = useState(getStoredLang);
  const [showLangModal, setShowLangModal] = useState(() => {
    try {
      return !localStorage.getItem('rentora_lang');
    } catch {
      return false;
    }
  });
  const [canCloseLangModal, setCanCloseLangModal] = useState(() => {
    try {
      return Boolean(localStorage.getItem('rentora_lang'));
    } catch {
      return true;
    }
  });

  const updateCartCount = () => {
    setCartCount(getStoredCartCount());
  };

  useEffect(() => {
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
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-20">
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
