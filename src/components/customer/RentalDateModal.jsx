import React, { useState, useEffect } from 'react';
import { X, Calendar, ShieldCheck, Clock, Check, Plus } from 'lucide-react';

// Format Date to YYYY-MM-DD for <input type="date">
const toInputDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Add days to a given date
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toInputDate(d);
};

// Calculate difference in days (minimum 1 day)
const calculateDays = (startStr, endStr) => {
  if (!startStr || !endStr) return 1;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays === 0 ? 1 : diffDays);
};

// Format date to readable string: 18 Nov 2026
const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export default function RentalDateModal({
  isOpen,
  onClose,
  product,
  onConfirmAdd,
}) {
  const today = toInputDate(new Date());
  const tomorrow = addDays(today, 1);

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(tomorrow);
  const [selectedDurationPreset, setSelectedDurationPreset] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset dates whenever a new product is selected
  useEffect(() => {
    if (product) {
      const curToday = toInputDate(new Date());
      setFromDate(curToday);
      setToDate(addDays(curToday, 1));
      setSelectedDurationPreset(1);
      setIsSubmitting(false);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const rentalDays = calculateDays(fromDate, toDate);
  const rentalSubtotal = product.rentalPrice * rentalDays;
  const refundableDeposit = Math.round(product.rentalPrice * 0.5);
  const totalAmount = rentalSubtotal + refundableDeposit;

  // Handle Preset Clicks (1 Day, 3 Days, 7 Days)
  const handlePresetDuration = (days) => {
    setSelectedDurationPreset(days);
    const newTo = addDays(fromDate, days);
    setToDate(newTo);
  };

  // Handle fromDate change
  const handleFromChange = (newFrom) => {
    setFromDate(newFrom);
    if (new Date(toDate) < new Date(newFrom)) {
      setToDate(addDays(newFrom, 1));
    }
  };

  // Handle toDate change
  const handleToChange = (newTo) => {
    if (new Date(newTo) >= new Date(fromDate)) {
      setToDate(newTo);
      setSelectedDurationPreset(null);
    }
  };

  const handleConfirm = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const configuredItem = {
      cartItemId: `${product.id}-${Date.now()}`,
      id: product.id,
      name: product.name,
      image: product.image,
      categoryName: product.categoryName,
      rentalPrice: product.rentalPrice,
      priceUnit: product.priceUnit || 'day',
      fromDate,
      toDate,
      formattedFrom: formatReadableDate(fromDate),
      formattedTo: formatReadableDate(toDate),
      rentalDays,
      subtotal: rentalSubtotal,
      deposit: refundableDeposit,
      totalAmount,
    };

    // Save to localStorage with duplicate prevention
    try {
      const currentCart = JSON.parse(localStorage.getItem('rentora_cart') || '[]');
      const existingIndex = currentCart.findIndex((item) => item.id === product.id);
      let updatedCart;
      if (existingIndex >= 0) {
        // Update existing item with new dates / duration
        updatedCart = [...currentCart];
        updatedCart[existingIndex] = configuredItem;
      } else {
        // Add new item
        updatedCart = [...currentCart, configuredItem];
      }
      localStorage.setItem('rentora_cart', JSON.stringify(updatedCart));
      window.dispatchEvent(new Event('rentora_cart_updated'));
    } catch {
      // Fallback
    }

    if (onConfirmAdd) {
      onConfirmAdd(configuredItem);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl border border-stone-300 flex flex-col relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-stone-900" />
          <h2 className="text-base font-bold text-stone-900">
            Select Rental Dates
          </h2>
        </div>

        {/* Tool Preview Banner */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200 mb-4">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {product.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium truncate">
              {product.categoryName}
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-bold text-stone-900">
                ₹{product.rentalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                /{product.priceUnit || 'day'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Duration Shortcuts */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1.5">
            Quick Duration
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { days: 1, label: '1 Day' },
              { days: 3, label: '3 Days' },
              { days: 7, label: '1 Week' },
            ].map((preset) => (
              <button
                key={preset.days}
                type="button"
                onClick={() => handlePresetDuration(preset.days)}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedDurationPreset === preset.days && rentalDays === preset.days
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Pickers (From / To) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              From (Pickup)
            </label>
            <input
              type="date"
              value={fromDate}
              min={today}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 hover:bg-stone-100 focus:bg-white text-stone-900 text-xs sm:text-sm font-medium rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/10 outline-none transition-all cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              To (Return)
            </label>
            <input
              type="date"
              value={toDate}
              min={fromDate}
              onChange={(e) => handleToChange(e.target.value)}
              className="w-full px-2.5 py-2 bg-stone-50 hover:bg-stone-100 focus:bg-white text-stone-900 text-xs sm:text-sm font-medium rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900/10 outline-none transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Rental Summary Breakdown */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Duration</span>
            <span className="font-bold text-stone-900">
              {rentalDays} {rentalDays === 1 ? 'day' : 'days'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>
              Rental Fee (₹{product.rentalPrice} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'})
            </span>
            <span className="font-bold text-stone-900">
              ₹{rentalSubtotal.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
              <span>Refundable Deposit</span>
            </span>
            <span className="font-medium text-stone-600">
              ₹{refundableDeposit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900">
              Total Payable at Pickup
            </span>
            <span className="text-sm sm:text-base font-black text-stone-900">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Confirm Add Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleConfirm}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
            isSubmitting
              ? 'bg-stone-400 text-white cursor-not-allowed'
              : 'bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>
            {isSubmitting
              ? 'Adding...'
              : `Confirm & Add to Cart • ₹${rentalSubtotal.toLocaleString('en-IN')}`}
          </span>
        </button>
      </div>
    </div>
  );
}

