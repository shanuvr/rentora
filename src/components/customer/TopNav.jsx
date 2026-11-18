import React from 'react';
import { User, ChevronDown, RotateCcw, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/products';

export default function TopNav({
  searchQuery,
  onSearchChange,
  onClearSearch,
  selectedCategory,
  onSelectCategory,
  onResetFilters,
  hasActiveFilters,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 pt-3 pb-2.5">
        {/* Brand Bar */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white font-black text-base">
              R
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black tracking-tight text-stone-900">
                Rentora
              </span>
              <span className="text-[9px] uppercase font-semibold tracking-widest text-stone-400 hidden xs:inline">
                Tools & Equipment
              </span>
            </div>
          </Link>

          <Link
            to="/profile"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="My Profile"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Search + Category */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-stone-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-9 pr-8 py-2 bg-stone-100 text-stone-900 placeholder:text-stone-400 text-sm rounded-lg border border-stone-200 focus:border-stone-400 focus:bg-white focus:ring-1 focus:ring-stone-400/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={onClearSearch}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category */}
          <div className="relative shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 bg-stone-100 text-stone-700 text-xs sm:text-sm font-medium rounded-lg border border-stone-200 focus:border-stone-400 focus:bg-white focus:ring-1 focus:ring-stone-400/20 outline-none cursor-pointer transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.id === 'all' ? 'All' : cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors shrink-0"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
