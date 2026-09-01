"use client";

import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-[#222222] bg-[#111111] p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-500/10 text-red-400">
            <AlertTriangle size={20} />
          </span>
          <h3 className="font-display text-base font-bold text-white">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-[#aaaaaa]">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#222222] px-4 py-2 text-sm font-medium text-white transition-colors hover:border-white/30"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
