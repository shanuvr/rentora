import React, { useRef } from 'react';
import {
  Wrench,
  Hammer,
  Disc,
  RotateCw,
  Flame,
  Layers,
  Droplets,
  Crosshair,
} from 'lucide-react';
import { CATEGORIES } from '../../data/products';

// Category icon map for tool trades
const CATEGORY_ICONS = {
  all: Wrench,
  drilling: Hammer,
  cutting: Disc,
  grinding: RotateCw,
  welding: Flame,
  concrete: Layers,
  cleaning: Droplets,
  measuring: Crosshair,
};

export default function CategoryList({ activeCategory, onSelectCategory }) {
  const scrollRef = useRef(null);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-4 sm:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = CATEGORY_ICONS[cat.id] || Wrench;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-blue-400' : 'text-slate-400'
                }`}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
