import React from 'react';
import { Wrench, RotateCcw, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../../data/products';

export default function FilterBar({
  selectedCategory,
  onSelectCategory,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-2 sm:p-2.5 shadow-2xs mb-3">
      <div className="flex items-center justify-between gap-2">
        {/* Category Dropdown */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full appearance-none pl-8 pr-8 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500/20 outline-none cursor-pointer transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.id === 'all' ? 'All Categories' : cat.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Results Count & Reset Button */}
        <div className="flex items-center gap-2 text-xs shrink-0 pr-1">
          <span className="text-slate-500 font-medium">
            <strong className="text-slate-900 font-bold">{totalResults}</strong> tools
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-semibold transition-colors"
              title="Reset category"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
