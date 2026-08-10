import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Cancel01Icon, CheckmarkCircle02Icon, AlertCircleIcon, InformationCircleIcon } from "hugeicons-react";
import { cn } from "../lib/utils";

type ToastTone = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-3.5 shadow-lg",
              t.tone === "success" && "border-success-200",
              t.tone === "error" && "border-error-200",
              t.tone === "warning" && "border-warning-200",
              t.tone === "info" && "border-blue-200",
            )}
          >
            <span
              className={cn(
                "mt-0.5",
                t.tone === "success" && "text-success-600",
                t.tone === "error" && "text-error-600",
                t.tone === "warning" && "text-warning-600",
                t.tone === "info" && "text-blue-600",
              )}
            >
              {t.tone === "success" && <CheckmarkCircle02Icon size={20} />}
              {t.tone === "error" && <AlertCircleIcon size={20} />}
              {t.tone === "warning" && <AlertCircleIcon size={20} />}
              {t.tone === "info" && <InformationCircleIcon size={20} />}
            </span>
            <p className="flex-1 text-sm font-medium text-gray-800">{t.message}</p>
            <button
              type="button"
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            >
              <Cancel01Icon size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
