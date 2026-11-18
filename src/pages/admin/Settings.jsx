import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Store,
  Clock,
  Shield,
} from 'lucide-react';

export default function AdminSettings() {
  const [hubName, setHubName] = useState('Rentora Main Equipment Hub');
  const [openingTime, setOpeningTime] = useState('07:00 AM');
  const [closingTime, setClosingTime] = useState('08:00 PM');
  const [hubSaved, setHubSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pwdStatus, setPwdStatus] = useState(null);

  const handleSaveHub = (e) => {
    e.preventDefault();
    setHubSaved(true);
    setTimeout(() => setHubSaved(false), 2500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setPwdStatus({ type: 'error', text: 'Please fill in all password fields.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwdStatus({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwdStatus({ type: 'success', text: 'Owner admin password updated successfully!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPwdStatus(null), 3500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Hub Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          Store parameters, pickup hours, and account security
        </p>
      </div>

      {/* Section 1: Store & Operating Hours */}
      <form
        onSubmit={handleSaveHub}
        className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Store className="w-4 h-4 text-stone-600" />
          <h2 className="text-sm font-bold text-stone-900">Hub Profile & Hours</h2>
        </div>

        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Store / Hub Name
          </label>
          <input
            type="text"
            value={hubName}
            onChange={(e) => setHubName(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Opening Time
            </label>
            <input
              type="text"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Closing Time
            </label>
            <input
              type="text"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Hub Details</span>
          </button>

          {hubSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved successfully</span>
            </span>
          )}
        </div>
      </form>

      {/* Section 2: Password Change */}
      <form
        onSubmit={handleChangePassword}
        className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-bold text-stone-900">Change Admin Password</h2>
          </div>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            {showPassword ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide Passwords</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Show Passwords</span>
              </>
            )}
          </button>
        </div>

        {/* Current Password */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Current Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
          />
        </div>

        {/* New Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 focus:bg-white border border-stone-300 rounded-lg focus:border-stone-900 outline-none transition-colors placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Feedback Messages */}
        {pwdStatus && (
          <div
            className={`p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
              pwdStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {pwdStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{pwdStatus.text}</span>
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </div>
  );
}
