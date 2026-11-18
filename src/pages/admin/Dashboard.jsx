import React from 'react';
import { ArrowLeft, ShieldCheck, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col justify-center items-center text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mb-4">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Rentora Owner / Admin Portal</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The admin dashboard sections (Bookings, Undelivered, Billing, Accounts, Settings) are planned for Part 2.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Customer Storefront
      </Link>
    </div>
  );
}

