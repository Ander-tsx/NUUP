import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function PendingBanner() {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>⚠ Esta sección aún no está conectada al backend. Los datos mostrados son de ejemplo.</span>
    </div>
  );
}
