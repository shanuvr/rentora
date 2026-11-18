import React, { useState } from 'react';
import { Check, Globe, X } from 'lucide-react';

export default function LanguageModal({
  isOpen,
  onClose,
  currentLang = 'en',
  onSelectLang,
  canClose = true,
}) {
  const [selected, setSelected] = useState(currentLang || 'en');

  if (!isOpen) return null;

  const handleContinue = () => {
    onSelectLang(selected);
    onClose();
  };

  const languages = [
    {
      id: 'en',
      title: 'English',
      nativeTitle: 'English',
      subtitle: 'Standard interface & search',
      badge: 'Default',
    },
    {
      id: 'ml',
      title: 'Malayalam',
      nativeTitle: 'മലയാളം',
      subtitle: 'ഉപകരണ വാടക (Tool Rentals)',
      badge: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-stone-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (only if language was already chosen before) */}
        {canClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
            <Globe className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              Choose Language
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              ഭാഷ തിരഞ്ഞെടുക്കുക
            </p>
          </div>
        </div>

        <p className="text-xs text-stone-600 mb-4 leading-relaxed">
          Select your preferred language for renting tools and equipment.
        </p>

        {/* Language Options */}
        <div className="space-y-2.5 mb-5">
          {languages.map((lang) => {
            const isChosen = selected === lang.id;
            return (
              <div
                key={lang.id}
                onClick={() => setSelected(lang.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isChosen
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                      isChosen
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isChosen && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900">
                        {lang.nativeTitle}
                      </span>
                      {lang.id !== 'en' && (
                        <span className="text-xs text-stone-500">
                          ({lang.title})
                        </span>
                      )}
                      {lang.badge && (
                        <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-stone-200 text-stone-700 ml-1">
                          {lang.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {lang.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleContinue}
          className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <span className="text-stone-400 font-normal">/</span>
          <span>തുടരുക</span>
        </button>
      </div>
    </div>
  );
}

