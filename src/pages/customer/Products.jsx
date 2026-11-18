import React, { useState, useMemo } from 'react';
import { PackageOpen } from 'lucide-react';
import TopNav from '../../components/customer/TopNav';
import ProductCard from '../../components/common/ProductCard';
import { DUMMY_PRODUCTS } from '../../data/products';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = useMemo(() => {
    return selectedCategory !== 'all' || searchQuery.trim().length > 0;
  }, [selectedCategory, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];

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
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (product) => {
    alert(`Rental date selection for "${product.name}" will open in Screen 3.`);
  };

  return (
    <div className="flex flex-col min-h-full">
      <TopNav
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery('')}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="px-3 sm:px-4 py-3 flex-1 flex flex-col">
        {/* Count */}
        <p className="text-[11px] text-stone-400 font-medium mb-2.5 px-0.5">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'tool' : 'tools'} available
        </p>

        {filteredProducts.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
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
    </div>
  );
}
