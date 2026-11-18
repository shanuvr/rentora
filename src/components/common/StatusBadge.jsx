import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export default function StatusBadge({ isAvailable, expectedAvailability }) {
  if (isAvailable) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
        Available
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200" title={expectedAvailability ? `Expected: ${expectedAvailability}` : 'Currently Unavailable'}>
      <Clock className="w-3 h-3 text-amber-600 shrink-0" />
      <span className="truncate">
        Unavailable {expectedAvailability ? `· ETA: ${expectedAvailability}` : ''}
      </span>
    </span>
  );
}

