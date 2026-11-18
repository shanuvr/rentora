import { useState, useMemo, useEffect } from 'react';
import { PackageOpen, CheckCircle2 } from 'lucide-react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import TopNav from '../../components/customer/TopNav';
import ProductCard from '../../components/common/ProductCard';
import RentalDateModal from '../../components/customer/RentalDateModal';
import { getStoredProducts } from '../../data/products';

export default function Products() {
  const navigate = useNavigate();
  const { selectedLang, openLanguageModal } = useOutletContext() || {};
  const [productsList, setProductsList] = useState(getStoredProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Track product IDs that are currently in the cart
  const [cartProductIds, setCartProductIds] = useState(() => {
    try {
      const stored = localStorage.getItem('rentora_cart');
      if (stored) {
        const items = JSON.parse(stored);
        if (Array.isArray(items)) {
          return new Set(items.map((i) => i.id).filter(Boolean));
        }
      }
      return new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    const handleUpdate = () => setProductsList(getStoredProducts());
    const handleCartSync = () => {
      try {
        const stored = localStorage.getItem('rentora_cart');
        if (stored) {
          const items = JSON.parse(stored);
          if (Array.isArray(items)) {
            setCartProductIds(new Set(items.map((i) => i.id).filter(Boolean)));
            return;
          }
        }
        setCartProductIds(new Set());
      } catch {
        setCartProductIds(new Set());
      }
    };

    window.addEventListener('rentora_products_updated', handleUpdate);
    window.addEventListener('rentora_cart_updated', handleCartSync);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('storage', handleCartSync);
    return () => {
      window.removeEventListener('rentora_products_updated', handleUpdate);
      window.removeEventListener('rentora_cart_updated', handleCartSync);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('storage', handleCartSync);
    };
  }, []);

  // Modal State for Screen 3
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = useMemo(() => {
    return selectedCategory !== 'all' || searchQuery.trim().length > 0;
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.categoryName.toLowerCase().includes(query) ||
          p.specs.some((spec) => spec.label.toLowerCase().includes(query)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory, productsList]);

  // Open the Rental Date Modal on Add
  const handleAddToCart = (product) => {
    setSelectedProductForModal(product);
  };

  // Called when item is successfully configured and added to cart
  const handleConfirmAddToCart = (configuredItem) => {
    setToastMessage(`"${configuredItem.name}" added for ${configuredItem.rentalDays} ${configuredItem.rentalDays === 1 ? 'day' : 'days'}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col min-h-full relative">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        selectedLang={selectedLang}
        onOpenLangModal={openLanguageModal}
      />

      <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col">
        {/* Count */}
        <p className="text-[11px] text-stone-400 font-medium mb-2.5 px-0.5">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'tool' : 'tools'} available
        </p>

        {filteredProducts.length > 0 ? (
          <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={cartProductIds.has(product.id)}
                onAddToCart={handleAddToCart}
                onSelect={handleAddToCart}
                onViewCart={() => navigate('/cart')}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 mb-3">
              <PackageOpen className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-stone-900 mb-1">
              No tools found
            </h3>
            <p className="text-xs text-stone-400 max-w-xs mb-4">
              Try a different search term or category.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Screen 3: Rental Date Selection Modal */}
      <RentalDateModal
        isOpen={Boolean(selectedProductForModal)}
        onClose={() => setSelectedProductForModal(null)}
        product={selectedProductForModal}
        onConfirmAdd={handleConfirmAddToCart}
      />

      {/* Toast Notification when added */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2.5 text-xs max-w-sm w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="truncate flex-1 font-medium">{toastMessage}</span>
          <Link
            to="/cart"
            className="font-bold underline text-amber-400 hover:text-amber-300 shrink-0"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
}
