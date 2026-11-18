import React from 'react';
import { User, Mail, Phone, MapPin, ArrowLeft, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const customer = {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    location: 'Kochi, Kerala, India',
    memberSince: 'October 2026',
  };

  return (
    <div className="p-4 flex flex-col min-h-full">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
        <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Customer Profile</h1>
      </div>

      <div className="py-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-2xl shadow-md mb-3">
          RS
        </div>
        <h2 className="text-lg font-bold text-slate-900">{customer.name}</h2>
        <span className="text-xs text-slate-500">Member since {customer.memberSince}</span>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3 mb-4">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <Phone className="w-4 h-4 text-indigo-600" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <Mail className="w-4 h-4 text-indigo-600" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>{customer.location}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <button
          type="button"
          onClick={() => alert('Profile editing is available in Screen 6.')}
          className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
        >
          Edit Profile
        </button>

        <button
          type="button"
          onClick={() => alert('Demo logout successful.')}
          className="w-full py-2.5 px-4 bg-slate-100 text-rose-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-50 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Log Out (Demo)
        </button>
      </div>
    </div>
  );
}

