"use client";

import * as React from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export function Dialog({ open, onClose, children, title }: DialogProps) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200/70">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
