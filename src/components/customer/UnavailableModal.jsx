import { X, Clock, Calendar, AlertCircle, ArrowRight } from 'lucide-react';

export default function UnavailableModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  const etaDate = product.expectedAvailability || 'Soon';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Item Already Booked
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5">
          {/* Tool Card Preview */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
            <div className="w-12 h-12 rounded-lg bg-white border border-stone-200 overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/tools/angle_grinder.jpg';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-stone-900 truncate">
                {product.name}
              </h4>
              <p className="text-[11px] text-stone-500 font-medium">
                {product.categoryName || 'Equipment'} · ₹{product.rentalPrice}/day
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Currently Out on Rental</span>
            </div>
            <p className="text-[11.5px] text-stone-600 leading-relaxed">
              Sorry, this item is currently rented out to another customer and cannot be added to your cart right now.
            </p>
          </div>

          {/* ETA Box */}
          <div className="p-3 rounded-xl bg-stone-900 text-white flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                  Expected Available (ETA)
                </span>
                <span className="text-sm font-black text-amber-400">
                  {etaDate}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700 shrink-0">
              Restock Date
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Browse Available Tools</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

