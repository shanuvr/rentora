import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  Calendar,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Lock,
  CreditCard,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [txnId, setTxnId] = useState('');
  const isPayingRef = useRef(false);

  // Load cart from localStorage with automatic duplicate cleanup
  const loadCart = () => {
    try {
      const stored = localStorage.getItem('rentora_cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Deduplicate by product id
          const unique = [];
          const seenIds = new Set();
          for (const item of parsed) {
            if (item && item.id && !seenIds.has(item.id)) {
              seenIds.add(item.id);
              unique.push(item);
            }
          }
          setCartItems(unique);

          // If duplicates were present in localStorage, heal it immediately
          if (unique.length !== parsed.length) {
            localStorage.setItem('rentora_cart', JSON.stringify(unique));
            window.dispatchEvent(new Event('rentora_cart_updated'));
          }
          return;
        }
      }
      setCartItems([]);
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleUpdate = () => loadCart();
    window.addEventListener('rentora_cart_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('rentora_cart_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Remove single item from cart
  const handleRemoveItem = (cartItemId) => {
    const updated = cartItems.filter((item) => item.cartItemId !== cartItemId);
    setCartItems(updated);
    localStorage.setItem('rentora_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('rentora_cart_updated'));
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (window.confirm('Clear all items from your rental cart?')) {
      setCartItems([]);
      localStorage.removeItem('rentora_cart');
      window.dispatchEvent(new Event('rentora_cart_updated'));
    }
  };

  // Calculations
  const rentalSubtotal = cartItems.reduce(
    (sum, item) => sum + (item.subtotal || 0),
    0
  );
  const totalDeposit = cartItems.reduce(
    (sum, item) => sum + (item.deposit || 0),
    0
  );
  const grandTotal = rentalSubtotal + totalDeposit;

  // Proceed to Book with Payment Simulation
  const handleProceedToPay = () => {
    if (isPayingRef.current || cartItems.length === 0 || paymentState !== 'idle') return;
    isPayingRef.current = true;

    // Step 1: Start Payment Processing
    const generatedTxnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxnId(generatedTxnId);
    setPaymentState('processing');

    // Step 2: 2-second realistic payment simulation
    setTimeout(() => {
      const newBooking = {
        bookingId: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
        txnId: generatedTxnId,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
        items: [...cartItems],
        subtotal: rentalSubtotal,
        depositAmount: totalDeposit,
        totalAmount: grandTotal,
      };

      // Save to bookings history in localStorage with idempotency
      try {
        const existing = JSON.parse(
          localStorage.getItem('rentora_bookings') || '[]'
        );
        const isDuplicate = existing.some(
          (b) =>
            b.totalAmount === grandTotal &&
            Math.abs(new Date().getTime() - new Date(b.createdAt).getTime()) < 5000
        );

        if (!isDuplicate) {
          localStorage.setItem(
            'rentora_bookings',
            JSON.stringify([newBooking, ...existing])
          );
        }
        localStorage.removeItem('rentora_cart');
        window.dispatchEvent(new Event('rentora_cart_updated'));
      } catch {
        // Fallback
      }

      setPaymentState('success');

      // Step 3: Redirect to My Rentals after success display
      setTimeout(() => {
        navigate('/bookings');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="p-3 sm:p-4 flex flex-col min-h-full relative">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="p-1.5 rounded-lg hover:bg-stone-200/60 text-stone-600 transition-colors"
            title="Back to Tools"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-stone-900">Rental Cart</h1>
            <p className="text-[11px] text-stone-500 font-medium">
              {cartItems.length} {cartItems.length === 1 ? 'tool' : 'tools'} selected
            </p>
          </div>
        </div>

        {cartItems.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="text-xs font-semibold text-stone-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length > 0 ? (
        /* Cart With Items */
        <div className="space-y-4">
          {/* Items List */}
          <div className="space-y-2.5">
            {cartItems.map((item) => (
              <div
                key={item.cartItemId}
                className="bg-white rounded-xl border border-stone-300 p-3 sm:p-4 shadow-xs flex items-center gap-3"
              >
                {/* Tool Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {item.name}
                      </h3>
                      <span className="text-[10px] text-stone-500 font-medium block">
                        {item.categoryName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.cartItemId)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 transition-colors shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dates Banner */}
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-stone-600 bg-stone-50 px-2 py-1 rounded-md border border-stone-200 w-fit">
                    <Calendar className="w-3 h-3 text-stone-500 shrink-0" />
                    <span className="font-semibold text-stone-900">
                      {item.formattedFrom} → {item.formattedTo}
                    </span>
                    <span className="text-stone-400">|</span>
                    <span className="text-stone-600 font-medium">
                      {item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'}
                    </span>
                  </div>

                  {/* Price Calculation Row */}
                  <div className="flex items-baseline justify-between mt-2 pt-1.5 border-t border-stone-100">
                    <span className="text-[11px] text-stone-500 font-medium">
                      ₹{item.rentalPrice} × {item.rentalDays} {item.rentalDays === 1 ? 'day' : 'days'}
                    </span>
                    <span className="text-sm font-bold text-stone-900 tabular-nums">
                      ₹{(item.subtotal || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-xl border border-stone-300 p-4 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Booking Summary
            </h2>

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Total Rental Charges ({cartItems.length} {cartItems.length === 1 ? 'tool' : 'tools'})</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  ₹{rentalSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Refundable Security Deposit</span>
                </span>
                <span className="font-medium text-stone-700 tabular-nums">
                  ₹{totalDeposit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-stone-900 block">
                  Total Payable at Pickup
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  Deposit refunded on safe equipment return
                </span>
              </div>
              <span className="text-base sm:text-lg font-black text-stone-900 tabular-nums">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Confirm & Pay Button */}
            <button
              type="button"
              disabled={paymentState !== 'idle'}
              onClick={handleProceedToPay}
              className={`w-full mt-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                paymentState !== 'idle'
                  ? 'bg-stone-400 text-white cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white cursor-pointer'
              }`}
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Confirm & Pay • ₹{grandTotal.toLocaleString('en-IN')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white border border-stone-300 shadow-2xs text-stone-400 flex items-center justify-center mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-stone-900 mb-1">
            Your rental cart is empty
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xs mb-5">
            Select tools and pick your rental dates to book tools for your job.
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-stone-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors shadow-xs"
          >
            Browse Tools & Gear
          </Link>
        </div>
      )}

      {/* Payment Simulation Modal Overlay */}
      {paymentState !== 'idle' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-stone-300 flex flex-col items-center text-center relative animate-in zoom-in-95 duration-200">
            {paymentState === 'processing' ? (
              <>
                {/* 2-Second Processing Spinner */}
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-3.5 shadow-xs">
                  <Loader2 className="w-7 h-7 text-stone-900 animate-spin" />
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Processing Payment...
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Simulating payment of{' '}
                  <strong className="text-stone-900">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </strong>
                </p>

                {/* Progress Bar Animation */}
                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-4">
                  <div className="bg-stone-900 h-full rounded-full animate-pulse w-3/4 transition-all duration-1000" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium">
                  <Lock className="w-3.5 h-3.5 text-stone-500" />
                  <span>256-bit Encrypted Demo Gateway</span>
                </div>
              </>
            ) : (
              <>
                {/* Success Animation */}
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3.5 shadow-xs animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-2">
                  Payment Successful
                </span>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Equipment Booked!
                </h3>

                <p className="text-xs text-stone-500 mb-3">
                  Transaction ID:{' '}
                  <span className="font-mono text-stone-800 font-semibold">
                    {txnId}
                  </span>
                </p>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 w-full mb-3 text-xs flex justify-between items-center">
                  <span className="text-stone-600 font-medium">Amount Paid</span>
                  <span className="font-bold text-stone-900 text-sm tabular-nums">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-[11px] text-stone-400 font-medium">
                  Redirecting to My Rentals...
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
