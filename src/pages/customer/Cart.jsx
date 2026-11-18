import React from 'react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div className="p-4 flex flex-col min-h-full">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Your Cart</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-slate-900 mb-1">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xs mb-4">
          Browse rental equipment and select your rental dates to add items to your cart.
        </p>
        <Link
          to="/"
          className="px-4 py-2 bg-indigo-600 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
        >
          Explore Equipment
        </Link>
      </div>
    </div>
  );
}

