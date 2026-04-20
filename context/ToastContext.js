"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

const ICONS = {
  success: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 10 8 14 16 6"/></svg>`,
  error:   `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="5" x2="15" y2="15"/><line x1="15" y1="5" x2="5" y2="15"/></svg>`,
  warning: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="12"/><circle cx="10" cy="15" r="0.5" fill="currentColor"/></svg>`,
  info:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><line x1="10" y1="9" x2="10" y2="14"/><circle cx="10" cy="6.5" r="0.5" fill="currentColor"/></svg>`,
};

function ToastContainer({ toasts, dismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast-notif toast-notif--${t.type}${t.leaving ? " toast-notif--leaving" : ""}`}
          role="alert"
        >
          <span
            className="toast-notif__icon"
            dangerouslySetInnerHTML={{ __html: ICONS[t.type] }}
          />
          <div className="toast-notif__body">
            <span className="toast-notif__title">{t.title}</span>
            {t.message && <span className="toast-notif__message">{t.message}</span>}
          </div>
          <button
            className="toast-notif__close"
            onClick={() => dismiss(t.id)}
            aria-label="Uždaryti"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
          <div className="toast-notif__progress" style={{ animationDuration: `${t.duration}ms` }} />
        </div>
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      if (timers.current.has(id)) {
        clearTimeout(timers.current.get(id));
        timers.current.delete(id);
      }
    }, 350);
  }, []);

  const toast = useCallback(({ type, title, message, duration = 4500 }) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    const timer = setTimeout(() => dismiss(id), duration);
    timers.current.set(id, timer);
  }, [dismiss]);

  const success = useCallback((title, message) => toast({ type: "success", title, message }), [toast]);
  const error   = useCallback((title, message) => toast({ type: "error",   title, message }), [toast]);
  const warning = useCallback((title, message) => toast({ type: "warning", title, message }), [toast]);
  const info    = useCallback((title, message) => toast({ type: "info",    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast turi būti naudojamas <ToastProvider> viduje");
  return ctx;
}
