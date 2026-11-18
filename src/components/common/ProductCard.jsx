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
      className="group bg-white rounded-xl overflow-hidden border border-stone-200/80 hover:border-stone-300 transition-all duration-150 flex flex-row cursor-pointer h-[138px] sm:h-[148px] md:h-[162px]"
    >
      {/* Image */}
      <div className="relative w-[110px] xs:w-[120px] sm:w-36 md:w-44 h-full bg-stone-100 shrink-0 overflow-hidden">
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
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-500'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between min-w-0">
        <div className="space-y-1.5">
          {/* Title */}
          <h3 className="text-[13px] sm:text-sm md:text-base font-semibold text-stone-900 leading-tight truncate">
            {name}
          </h3>

          {/* Tag + Specs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-hidden whitespace-nowrap flex-nowrap">
            {tags[0] && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-semibold bg-amber-50 text-amber-700 shrink-0">
                {tags[0]}
              </span>
            )}
            {specs.slice(0, 3).map((spec, idx) => {
              const Icon = SPEC_ICONS[spec.icon] || Zap;
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9.5px] font-medium text-stone-500 bg-stone-50 shrink-0"
                >
                  <Icon className="w-2.5 h-2.5 text-stone-400" />
                  {spec.label}
                </span>
              );
            })}
          </div>

          {/* Bullet */}
          {bullets[0] && (
            <p className="text-[9.5px] sm:text-[11px] text-stone-500 truncate leading-snug">
              {bullets[0]}
            </p>
          )}
        </div>

        {/* Bottom: Price + Status + Button */}
        <div className="flex items-center justify-between gap-1.5 pt-1.5 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            {/* Price */}
            <div className="flex items-baseline gap-0.5 shrink-0">
              <span className="text-sm sm:text-base md:text-lg font-bold text-stone-900 tabular-nums">
                ₹{rentalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-400 font-medium">
                /{priceUnit}
              </span>
            </div>

            {/* Status */}
            {isAvailable ? (
              <span className="inline-flex items-center gap-0.5 text-[8.5px] sm:text-[10px] font-medium text-emerald-600 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[8.5px] sm:text-[10px] font-medium text-stone-400 truncate max-w-[110px] sm:max-w-none shrink-0">
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span className="truncate">
                  {expectedAvailability ? `ETA: ${expectedAvailability}` : 'Soon'}
                </span>
              </span>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable && onAddToCart) onAddToCart(product);
            }}
            className={`inline-flex items-center justify-center gap-0.5 h-7 sm:h-8 px-3 sm:px-4 rounded-lg font-semibold text-[10.5px] sm:text-xs transition-all duration-100 shrink-0 ${
              isAvailable
                ? 'bg-stone-900 hover:bg-stone-800 active:scale-95 text-white'
                : 'bg-stone-100 text-stone-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            {isAvailable ? 'Add' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}
