import React, { useState, useEffect } from 'react';
import {
  Heart,
  Zap,
  Settings,
  Gauge,
  Shield,
  BatteryCharging,
  Disc,
  Maximize2,
  Activity,
  Cpu,
  Layers,
  RotateCw,
  Truck,
  Droplets,
  Crosshair,
  Eye,
  Flame,
  Clock,
  Plus,
  Wrench,
} from 'lucide-react';

const SPEC_ICONS = {
  Zap, Settings, Gauge, Shield, BatteryCharging, Disc, Maximize2,
  Activity, Cpu, Layers, RotateCw, Truck, Droplets, Crosshair, Eye, Flame,
};

const formatETA = (dateStr) => {
  if (!dateStr) return 'Soon';
  return dateStr
    .replace(/\s*\d{4}$/, '')
    .replace('November', 'Nov')
    .replace('December', 'Dec');
};

export default function ProductCard({ product, onAddToCart, onSelect }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgError, setImgError] = useState(false);

  const {
    id, name, image, specs = [], tags = [], bullets = [], offer,
    rentalPrice, priceUnit = 'day', isAvailable = true, expectedAvailability,
  } = product;

  useEffect(() => { setImgError(false); }, [image]);

  return (
    <div
      onClick={() => onSelect && onSelect(product)}
      className="group bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-stone-300 transition-all duration-150 flex flex-row cursor-pointer h-[154px] sm:h-[158px] md:h-[168px]"
    >
      {/* Left Column: Image */}
      <div className="relative w-[112px] xs:w-[122px] sm:w-36 md:w-44 h-full bg-stone-100 shrink-0 overflow-hidden">
        {!imgError ? (
          <img
            src={image}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-300 p-2 text-center">
            <Wrench className="w-6 h-6 mb-1" />
            <span className="text-[9px] font-medium text-stone-400">No Image</span>
          </div>
        )}

        {/* Heart */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all active:scale-90"
          title="Save"
        >
          <Heart
            className={`w-3 h-3 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'
              }`}
          />
        </button>
      </div>

      {/* Right Column: Content */}
      <div className="flex-1 p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between min-w-0">
        <div>
          {/* Title */}
          <h3 className="text-[13px] sm:text-sm md:text-base font-semibold text-stone-900 leading-tight truncate">
            {name}
          </h3>

          {/* Tag & Specs (Wrapped across lines so all specs + tag are fully visible on mobile) */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1.5">
            {tags[0] && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9.5px] sm:text-[10px] md:text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 shrink-0">
                {tags[0]}
              </span>
            )}
            {specs.slice(0, 3).map((spec, idx) => {
              const Icon = SPEC_ICONS[spec.icon] || Zap;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] md:text-[11px] font-medium text-stone-600 bg-stone-100/90 shrink-0"
                >
                  <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400" />
                  <span>{spec.label}</span>
                </span>
              );
            })}
          </div>

          {/* Bullet Highlight */}
          {bullets[0] && (
            <p className="text-[9.5px] sm:text-[10.5px] md:text-[11px] text-stone-500 truncate mt-1.5 leading-snug">
              {bullets[0]}
            </p>
          )}
        </div>

        {/* Bottom Section: Space above price is used for ETA if unavailable */}
        <div className="mt-auto pt-1 flex items-end justify-between gap-1.5">
          <div className="min-w-0">
            {/* ETA badge right above price when unavailable */}
            {!isAvailable && (
                <div className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] md:text-xs font-semibold text-amber-800 mb-0.5 whitespace-nowrap">
                  <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                  <span>ETA: {formatETA(expectedAvailability)}</span>
                </div>
            )}

                {/* Price Row */}
                <div className="flex items-baseline gap-1">
                  <span className="text-sm sm:text-base md:text-lg font-bold text-stone-900 tabular-nums">
                    ₹{rentalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium">
                    /{priceUnit}
                  </span>
                  {isAvailable && (
                    <span className="ml-1.5 inline-flex items-center gap-1 text-[9.5px] sm:text-[10.5px] font-medium text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      In Stock
                    </span>
                  )}
                </div>
              </div>

          {/* CTA Button */}
            <button
              type="button"
              disabled={!isAvailable}
              onClick={(e) => {
                e.stopPropagation();
                if (isAvailable && onAddToCart) onAddToCart(product);
              }}
              className={`inline-flex items-center justify-center gap-0.5 h-7 sm:h-8 px-3 sm:px-4 rounded-lg font-semibold text-[10.5px] sm:text-xs transition-all duration-100 shrink-0 ${isAvailable
                  ? 'bg-stone-900 hover:bg-stone-800 active:scale-95 text-white'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                }`}
            >
              {isAvailable && <Plus className="w-3 h-3 stroke-[2.5]" />}
              <span>{isAvailable ? 'Add' : 'Unavailable'}</span>
            </button>
          </div>
        </div>
      </div>
      );
}
