import React from 'react';
import { Mail, Phone, MapPin, ArrowLeft, LogOut, Globe } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

export default function Profile() {
  const { selectedLang, openLanguageModal } = useOutletContext() || {};

  const customer = {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    location: 'Kochi, Kerala, India',
    memberSince: 'October 2026',
  };

  return (
    <div className="p-4 flex flex-col min-h-full">
      {/* Top Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-stone-200">
        <Link
          to="/"
          className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-bold text-stone-900">Customer Profile</h1>
      </div>

      {/* Profile Header */}
      <div className="py-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-bold text-xl shadow-sm mb-3">
          RS
        </div>
        <h2 className="text-base font-bold text-stone-900">{customer.name}</h2>
        <span className="text-xs text-stone-500">
          Member since {customer.memberSince}
        </span>
      </div>

      {/* Contact Details */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-2xs space-y-3 mb-3">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <Phone className="w-4 h-4 text-stone-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <Mail className="w-4 h-4 text-stone-400" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center gap-3 text-xs sm:text-sm text-stone-700">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span>{customer.location}</span>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="bg-white rounded-xl p-4 border border-stone-200/90 shadow-2xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-stone-900 block">
              Language / ഭാഷ
            </span>
            <span className="text-[11px] text-stone-500">
              {selectedLang === 'ml' ? 'മലയാളം (Malayalam)' : 'English'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openLanguageModal}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
        >
          Change
        </button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          type="button"
          onClick={() => alert('Profile editing is available in Screen 6.')}
          className="w-full py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-2xs"
        >
          Edit Profile
        </button>

        <button
          type="button"
          onClick={() => alert('Demo logout successful.')}
          className="w-full py-2.5 px-4 bg-stone-100 text-rose-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-rose-50 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          Log Out (Demo)
        </button>
      </div>
    </div>
  );
}
